using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/tenancies")]
[Authorize]
public class RentalTenanciesController : ControllerBase
{
    private const long MaximumAgreementBytes = 15 * 1024 * 1024;
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public RentalTenanciesController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [Authorize(Roles = "Owner")]
    [HttpPost("from-enquiry/{enquiryId:int}")]
    public async Task<IActionResult> CreateFromEnquiry(int enquiryId, CreateRentalTenancyDto request)
    {
        var ownerId = GetUserId();
        var enquiryDetails = await (
            from enquiry in _context.PropertyEnquiries
            join property in _context.Properties on enquiry.PropertyId equals property.Id
            where enquiry.Id == enquiryId && property.OwnerId == ownerId
            select new { Enquiry = enquiry, Property = property }
        ).FirstOrDefaultAsync();
        if (enquiryDetails == null) return NotFound(new { message = "Enquiry not found." });

        if (request.LeaseEndDate.Date <= request.LeaseStartDate.Date)
        {
            return BadRequest(new { message = "The lease end date must be after the start date." });
        }

        var today = DateTime.UtcNow.Date;
        var existingTenancy = await _context.RentalTenancies.AnyAsync(tenancy =>
            tenancy.PropertyId == enquiryDetails.Property.Id &&
            tenancy.RenterId == enquiryDetails.Enquiry.UserId &&
            tenancy.Status != "Declined" &&
            tenancy.Status != "Ended" &&
            (tenancy.Status == "PendingRenterConfirmation" || tenancy.LeaseEndDate >= today));
        if (existingTenancy)
        {
            return Conflict(new { message = "An active or pending tenancy already exists for this renter and property." });
        }

        var tenancy = new RentalTenancy
        {
            PropertyId = enquiryDetails.Property.Id,
            OwnerId = ownerId,
            RenterId = enquiryDetails.Enquiry.UserId,
            MonthlyRent = request.MonthlyRent,
            LeaseStartDate = request.LeaseStartDate.Date,
            LeaseEndDate = request.LeaseEndDate.Date
        };
        _context.RentalTenancies.Add(tenancy);
        _context.Notifications.Add(new Notification
        {
            UserId = tenancy.RenterId,
            PropertyId = tenancy.PropertyId,
            Message = $"The owner proposed a tenancy for {enquiryDetails.Property.Title}. Review the dates and confirm it in your tenancy dashboard."
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = "Tenancy proposal sent to the renter.", tenancyId = tenancy.Id });
    }

    [Authorize(Roles = "Owner")]
    [HttpGet("owner")]
    public async Task<IActionResult> GetOwnerTenancies()
    {
        var ownerId = GetUserId();
        var tenancies = await (
            from tenancy in _context.RentalTenancies
            join property in _context.Properties on tenancy.PropertyId equals property.Id
            join renter in _context.Users on tenancy.RenterId equals renter.Id
            where tenancy.OwnerId == ownerId
            orderby tenancy.CreatedAt descending
            select new
            {
                tenancy.Id,
                tenancy.MonthlyRent,
                tenancy.LeaseStartDate,
                tenancy.LeaseEndDate,
                tenancy.Status,
                tenancy.CreatedAt,
                HasAgreement = tenancy.AgreementStorageName != null,
                tenancy.AgreementFileName,
                Property = new { property.Id, property.Title },
                Renter = new { renter.Id, renter.FullName, renter.Email, renter.PhoneNumber }
            }
        ).ToListAsync();

        return Ok(tenancies);
    }

    [Authorize(Roles = "User")]
    [HttpGet("mine")]
    public async Task<IActionResult> GetMyTenancies()
    {
        var renterId = GetUserId();
        var tenancies = await (
            from tenancy in _context.RentalTenancies
            join property in _context.Properties on tenancy.PropertyId equals property.Id
            join owner in _context.Users on tenancy.OwnerId equals owner.Id
            where tenancy.RenterId == renterId
            orderby tenancy.CreatedAt descending
            select new
            {
                tenancy.Id,
                tenancy.MonthlyRent,
                tenancy.LeaseStartDate,
                tenancy.LeaseEndDate,
                tenancy.Status,
                tenancy.CreatedAt,
                HasAgreement = tenancy.AgreementStorageName != null,
                tenancy.AgreementFileName,
                Property = new { property.Id, property.Title, property.Location },
                Owner = new { owner.FullName, owner.Email, owner.PhoneNumber }
            }
        ).ToListAsync();

        return Ok(tenancies);
    }

    [Authorize(Roles = "User")]
    [HttpPatch("{tenancyId:int}/confirmation")]
    public async Task<IActionResult> ConfirmTenancy(int tenancyId, ConfirmRentalTenancyDto request)
    {
        var renterId = GetUserId();
        var tenancy = await _context.RentalTenancies.FirstOrDefaultAsync(item =>
            item.Id == tenancyId && item.RenterId == renterId);
        if (tenancy == null) return NotFound(new { message = "Tenancy proposal not found." });
        if (tenancy.Status != "PendingRenterConfirmation")
        {
            return Conflict(new { message = "This tenancy proposal has already been resolved." });
        }

        tenancy.RenterConfirmed = request.Confirm;
        tenancy.Status = request.Confirm ? "Confirmed" : "Declined";
        if (request.Confirm)
        {
            tenancy.ConfirmedAt = DateTime.UtcNow;
            var property = await _context.Properties.FindAsync(tenancy.PropertyId);
            if (property != null) property.IsAvailable = false;
        }

        _context.Notifications.Add(new Notification
        {
            UserId = tenancy.OwnerId,
            PropertyId = tenancy.PropertyId,
            Message = request.Confirm
                ? "The renter confirmed the proposed tenancy."
                : "The renter declined the proposed tenancy."
        });
        await _context.SaveChangesAsync();
        return Ok(new { message = request.Confirm ? "Tenancy mutually confirmed." : "Tenancy proposal declined.", tenancy.Status });
    }

    [Authorize(Roles = "Owner")]
    [HttpPost("{tenancyId:int}/agreement")]
    [RequestSizeLimit(MaximumAgreementBytes + 1024)]
    public async Task<IActionResult> UploadAgreement(int tenancyId, IFormFile file)
    {
        var ownerId = GetUserId();
        var tenancy = await _context.RentalTenancies.FirstOrDefaultAsync(item =>
            item.Id == tenancyId && item.OwnerId == ownerId);
        if (tenancy == null) return NotFound(new { message = "Tenancy not found." });
        if (tenancy.AgreementStorageName != null)
        {
            return Conflict(new { message = "A signed agreement is already attached to this tenancy." });
        }
        if (file == null || file.Length == 0)
        {
            return BadRequest(new { message = "Choose a PDF agreement to upload." });
        }
        if (file.Length > MaximumAgreementBytes)
        {
            return BadRequest(new { message = "The agreement must be 15 MB or smaller." });
        }
        if (!string.Equals(Path.GetExtension(file.FileName), ".pdf", StringComparison.OrdinalIgnoreCase) ||
            !string.Equals(file.ContentType, "application/pdf", StringComparison.OrdinalIgnoreCase))
        {
            return BadRequest(new { message = "Only PDF agreements are supported." });
        }

        await using (var stream = file.OpenReadStream())
        {
            var header = new byte[5];
            var bytesRead = await stream.ReadAsync(header, 0, header.Length);
            if (bytesRead != header.Length || Encoding.ASCII.GetString(header) != "%PDF-")
            {
                return BadRequest(new { message = "The uploaded file is not a valid PDF." });
            }
        }

        var agreementDirectory = Path.Combine(_environment.ContentRootPath, "App_Data", "RentalAgreements");
        Directory.CreateDirectory(agreementDirectory);
        var storageName = $"{Guid.NewGuid():N}.pdf";
        var storagePath = Path.Combine(agreementDirectory, storageName);
        await using (var destination = new FileStream(storagePath, FileMode.CreateNew, FileAccess.Write, FileShare.None))
        await using (var source = file.OpenReadStream())
        {
            await source.CopyToAsync(destination);
        }

        tenancy.AgreementStorageName = storageName;
        tenancy.AgreementFileName = Path.GetFileName(file.FileName);
        await _context.SaveChangesAsync();
        _context.Notifications.Add(new Notification
        {
            UserId = tenancy.RenterId,
            PropertyId = tenancy.PropertyId,
            Message = "The owner uploaded a signed rental agreement for your tenancy."
        });
        await _context.SaveChangesAsync();

        return Ok(new { message = "Signed agreement uploaded." });
    }

    [HttpGet("{tenancyId:int}/agreement")]
    public async Task<IActionResult> DownloadAgreement(int tenancyId)
    {
        var userId = GetUserId();
        var tenancy = await _context.RentalTenancies.FirstOrDefaultAsync(item => item.Id == tenancyId);
        if (tenancy == null) return NotFound(new { message = "Tenancy not found." });
        if (tenancy.OwnerId != userId && tenancy.RenterId != userId)
        {
            return Forbid();
        }
        if (tenancy.AgreementStorageName == null || tenancy.AgreementFileName == null)
        {
            return NotFound(new { message = "No signed agreement has been uploaded." });
        }

        var storageName = tenancy.AgreementStorageName;
        if (!string.Equals(Path.GetFileName(storageName), storageName, StringComparison.Ordinal) ||
            !string.Equals(Path.GetExtension(storageName), ".pdf", StringComparison.OrdinalIgnoreCase))
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = "Agreement storage metadata is invalid." });
        }

        var storagePath = Path.Combine(_environment.ContentRootPath, "App_Data", "RentalAgreements", storageName);
        if (!System.IO.File.Exists(storagePath))
        {
            return NotFound(new { message = "The agreement file is unavailable." });
        }

        return PhysicalFile(storagePath, "application/pdf", tenancy.AgreementFileName);
    }

    private int GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId)
            ? userId
            : throw new UnauthorizedAccessException("User identity is missing.");
    }
}
