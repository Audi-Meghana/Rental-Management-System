using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/support/tickets")]
public class SupportTicketsController : ControllerBase
{
    private const long MaximumAttachmentSize = 5 * 1024 * 1024;
    private static readonly Dictionary<string, string> SupportedAttachmentTypes = new(StringComparer.OrdinalIgnoreCase)
    {
        ["application/pdf"] = ".pdf",
        ["image/jpeg"] = ".jpg",
        ["image/png"] = ".png",
        ["image/webp"] = ".webp"
    };
    private static readonly string[] Categories =
    [
        "Property Listing Issue", "Owner / Tenant Issue", "Payment / Rent Issue",
        "Agreement Issue", "Fake Listing / Fraud", "Account Issue", "Other"
    ];

    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public SupportTicketsController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpPost]
    [RequestSizeLimit(MaximumAttachmentSize + 1024 * 1024)]
    public async Task<IActionResult> Create([FromForm] CreateSupportTicketDto request)
    {
        if (request.RequesterType is not ("Tenant" or "Owner"))
        {
            return BadRequest(new { message = "Choose Tenant / Renter or Property Owner." });
        }

        if (!Categories.Contains(request.Category))
        {
            return BadRequest(new { message = "Choose a supported issue category." });
        }

        var attachment = request.Attachment;
        var storageName = string.Empty;
        var originalFileName = string.Empty;
        string? attachmentPath = null;
        if (attachment != null)
        {
            if (attachment.Length == 0 || attachment.Length > MaximumAttachmentSize)
            {
                return BadRequest(new { message = "An attachment must be larger than 0 bytes and no more than 5 MB." });
            }

            if (!SupportedAttachmentTypes.TryGetValue(attachment.ContentType, out var extension))
            {
                return BadRequest(new { message = "Only JPG, PNG, WEBP, and PDF attachments are supported." });
            }

            storageName = $"{Guid.NewGuid():N}{extension}";
            var suppliedFileName = Path.GetFileName(attachment.FileName);
            originalFileName = suppliedFileName.Length > 250 ? suppliedFileName[^250..] : suppliedFileName;
            attachmentPath = Path.Combine(_environment.ContentRootPath, "App_Data", "support-attachments", storageName);
            Directory.CreateDirectory(Path.GetDirectoryName(attachmentPath)!);
            await using (var stream = System.IO.File.Create(attachmentPath))
            {
                await attachment.CopyToAsync(stream);
            }
        }

        var now = DateTime.UtcNow;
        var ticket = new SupportTicket
        {
            TicketCode = await CreateTicketCodeAsync(),
            RequesterType = request.RequesterType,
            FullName = request.FullName.Trim(),
            Email = request.Email.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Category = request.Category,
            Subject = request.Subject.Trim(),
            Description = request.Description.Trim(),
            AttachmentFileName = originalFileName,
            AttachmentStorageName = storageName,
            Status = "Submitted",
            CreatedAt = now,
            UpdatedAt = now
        };

        _context.SupportTickets.Add(ticket);
        try
        {
            await _context.SaveChangesAsync();
        }
        catch
        {
            if (attachmentPath != null && System.IO.File.Exists(attachmentPath))
            {
                System.IO.File.Delete(attachmentPath);
            }

            throw;
        }

        return Ok(new { ticket.TicketCode, ticket.Status, ticket.CreatedAt });
    }

    [HttpGet("{ticketCode}")]
    public async Task<IActionResult> Track(string ticketCode)
    {
        var normalizedCode = ticketCode.Trim().ToUpperInvariant();
        var ticket = await _context.SupportTickets
            .Where(item => item.TicketCode == normalizedCode)
            .Select(item => new
            {
                item.TicketCode,
                item.RequesterType,
                item.Category,
                item.Subject,
                item.Status,
                item.CreatedAt,
                item.UpdatedAt,
                item.ResolvedAt
            })
            .FirstOrDefaultAsync();
        return ticket == null ? NotFound(new { message = "No support ticket matches that ID." }) : Ok(ticket);
    }

    private async Task<string> CreateTicketCodeAsync()
    {
        string ticketCode;
        do
        {
            ticketCode = $"MH-{Convert.ToHexString(RandomNumberGenerator.GetBytes(6))}";
        } while (await _context.SupportTickets.AnyAsync(ticket => ticket.TicketCode == ticketCode));

        return ticketCode;
    }
}
