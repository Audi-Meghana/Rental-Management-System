using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Services;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PropertiesController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly AppDbContext _context;

    public PropertiesController(
        IPropertyService propertyService,
        AppDbContext context)
    {
        _propertyService = propertyService;
        _context = context;
    }

    // GET: api/Properties
    // Example:
    // api/Properties?location=Tirupati&minRent=10000
    [HttpGet]
    public async Task<IActionResult> GetProperties(
        string? location,
        string? zipCode,
        decimal? minRent,
        decimal? maxRent,
        int? bedrooms,
        bool? isAvailable)
    {
        var properties = await _propertyService.GetAllAsync(
            location,
            zipCode,
            minRent,
            maxRent,
            bedrooms,
            isAvailable);

        return Ok(properties);
    }

    // GET: api/Properties/1
    [HttpGet("{id}")]
    public async Task<IActionResult> GetProperty(int id)
    {
        var property = await _context.Properties
            .FirstOrDefaultAsync(item => item.Id == id);

        if (property == null)
        {
            return NotFound("Property not found.");
        }

        var owner = property.OwnerId.HasValue
            ? await _context.Users.FindAsync(property.OwnerId.Value)
            : null;

        return Ok(new
        {
            property.Id,
            property.Title,
            property.Location,
            property.ZipCode,
            property.Rent,
            property.Description,
            property.Bedrooms,
            property.IsAvailable,
            property.ImageUrl,
            property.ImageUrls,
            Owner = owner == null ? null : new
            {
                owner.Id,
                owner.FullName,
                owner.Email,
                owner.PhoneNumber,
                owner.Location
            }
        });
    }

    [Authorize(Roles = "Owner")]
    [HttpGet("owner")]
    public async Task<IActionResult> GetOwnerProperties()
    {
        var ownerId = GetUserId();
        var properties = await _propertyService.GetByOwnerIdAsync(ownerId);

        return Ok(properties);
    }

    [Authorize(Roles = "Owner")]
    [HttpPost("upload-image")]
    public async Task<IActionResult> UploadImage(IFormFile image)
    {
        if (image == null || image.Length == 0)
        {
            return BadRequest(new { message = "Please choose an image." });
        }

        var allowedTypes = new[] { "image/jpeg", "image/png", "image/webp" };

        if (!allowedTypes.Contains(image.ContentType.ToLowerInvariant()))
        {
            return BadRequest(new { message = "Only JPG, PNG, and WEBP images are supported." });
        }

        if (image.Length > 5 * 1024 * 1024)
        {
            return BadRequest(new { message = "Images must be smaller than 5 MB." });
        }

        var uploadsPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
        Directory.CreateDirectory(uploadsPath);

        var extension = Path.GetExtension(image.FileName).ToLowerInvariant();
        var fileName = $"{Guid.NewGuid():N}{extension}";
        var filePath = Path.Combine(uploadsPath, fileName);

        await using var stream = System.IO.File.Create(filePath);
        await image.CopyToAsync(stream);

        return Ok(new
        {
            imageUrl = $"/uploads/{fileName}"
        });
    }

    // POST: api/Properties
    [HttpPost]
    public async Task<IActionResult> CreateProperty(
        CreatePropertyDto dto)
    {
        var ownerId = User.Identity?.IsAuthenticated == true
            ? (int?)GetUserId()
            : null;
        var property = await _propertyService.CreateAsync(dto, ownerId);

        return Ok(property);
    }

    // PUT: api/Properties/1
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateProperty(
        int id,
        UpdatePropertyDto dto)
    {
        var ownerId = User.Identity?.IsAuthenticated == true
            ? (int?)GetUserId()
            : null;
        var property = await _propertyService.UpdateAsync(id, dto, ownerId);

        if (property == null)
        {
            return NotFound("Property not found.");
        }

        return Ok(property);
    }

    // DELETE: api/Properties/1
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty(int id)
    {
        var ownerId = User.Identity?.IsAuthenticated == true
            ? (int?)GetUserId()
            : null;
        var deleted = await _propertyService.DeleteAsync(id, ownerId);

        if (!deleted)
        {
            return NotFound("Property not found.");
        }

        return Ok("Property deleted successfully.");
    }

    private int GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);

        return int.TryParse(claim, out var userId)
            ? userId
            : throw new UnauthorizedAccessException("User identity is missing.");
    }
}