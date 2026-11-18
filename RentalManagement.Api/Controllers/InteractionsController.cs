using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/interactions")]
[Authorize]
public class InteractionsController : ControllerBase
{
    private readonly AppDbContext _context;

    public InteractionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("interest/{propertyId:int}")]
    public async Task<IActionResult> ShowInterest(int propertyId)
    {
        var userId = GetUserId();
        var property = await _context.Properties.FirstOrDefaultAsync(p => p.Id == propertyId);

        if (property == null) return NotFound(new { message = "Property not found." });

        var existing = await _context.PropertyInterests
            .FirstOrDefaultAsync(i => i.UserId == userId && i.PropertyId == propertyId);

        if (existing != null) return Ok(new { message = "You are already interested in this property.", interest = existing });

        var interest = new PropertyInterest
        {
            UserId = userId,
            PropertyId = propertyId,
            OwnerId = property.OwnerId
        };

        _context.PropertyInterests.Add(interest);
        if (property.OwnerId.HasValue)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = property.OwnerId.Value,
                PropertyId = property.Id,
                Message = "A user is interested in your property."
            });
        }

        _context.Notifications.Add(new Notification
        {
            UserId = userId,
            PropertyId = property.Id,
            Message = $"Your interest was registered for {property.Title}."
        });

        await _context.SaveChangesAsync();
        return Ok(new { message = "You're interested in this property!", interest });
    }

    [Authorize(Roles = "User")]
    [HttpPost("enquiry/{propertyId:int}")]
    public async Task<IActionResult> CreateEnquiry(int propertyId, PropertyEnquiryDto request)
    {
        var userId = GetUserId();
        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null) return NotFound(new { message = "Property not found." });

        if (request.PreferredVisitDate.HasValue &&
            request.PreferredVisitDate.Value.Date < DateTime.UtcNow.Date)
        {
            return BadRequest(new { message = "The preferred visit date cannot be in the past." });
        }

        var preferredVisitTime = request.PreferredVisitTime?.Trim() ?? string.Empty;
        if (request.PreferredVisitDate.HasValue != (preferredVisitTime.Length > 0))
        {
            return BadRequest(new { message = "Provide both a visit date and time, or leave both empty." });
        }

        var enquiry = new PropertyEnquiry
        {
            PropertyId = property.Id,
            UserId = userId,
            FullName = request.FullName.Trim(),
            PhoneNumber = request.PhoneNumber.Trim(),
            Email = request.Email.Trim(),
            PreferredVisitDate = request.PreferredVisitDate,
            PreferredVisitTime = preferredVisitTime,
            NumberOfOccupants = request.NumberOfOccupants,
            Message = request.Message.Trim()
        };
        _context.PropertyEnquiries.Add(enquiry);

        var existingInterest = await _context.PropertyInterests
            .FirstOrDefaultAsync(interest =>
                interest.UserId == userId && interest.PropertyId == propertyId);
        if (existingInterest == null)
        {
            _context.PropertyInterests.Add(new PropertyInterest
            {
                UserId = userId,
                PropertyId = propertyId,
                OwnerId = property.OwnerId
            });
        }

        if (property.OwnerId.HasValue)
        {
            _context.Notifications.Add(new Notification
            {
                UserId = property.OwnerId.Value,
                PropertyId = property.Id,
                Message = $"A renter sent an enquiry about {property.Title}."
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Your enquiry has been sent to the property owner.", enquiryId = enquiry.Id });
    }

    [Authorize(Roles = "Owner")]
    [HttpGet("owner-enquiries")]
    public async Task<IActionResult> OwnerEnquiries()
    {
        var ownerId = GetUserId();
        var enquiries = await (
            from enquiry in _context.PropertyEnquiries
            join property in _context.Properties on enquiry.PropertyId equals property.Id
            where property.OwnerId == ownerId
            orderby enquiry.CreatedAt descending
            select new
            {
                enquiry.Id,
                enquiry.CreatedAt,
                enquiry.PreferredVisitDate,
                enquiry.PreferredVisitTime,
                enquiry.NumberOfOccupants,
                enquiry.Message,
                enquiry.Status,
                Property = new { property.Id, property.Title, property.Rent },
                Renter = new { enquiry.FullName, enquiry.PhoneNumber, enquiry.Email }
            }
        ).ToListAsync();

        return Ok(enquiries);
    }

    [Authorize(Roles = "Owner")]
    [HttpPatch("enquiry/{enquiryId:int}/status")]
    public async Task<IActionResult> UpdateEnquiryStatus(int enquiryId, EnquiryStatusRequest request)
    {
        var ownerId = GetUserId();
        if (request.Status is not ("Accepted" or "Declined" or "Responded"))
        {
            return BadRequest(new { message = "Choose Accepted, Declined, or Responded." });
        }

        var enquiry = await _context.PropertyEnquiries
            .Join(_context.Properties, item => item.PropertyId, property => property.Id,
                (item, property) => new { Enquiry = item, Property = property })
            .Where(item => item.Enquiry.Id == enquiryId && item.Property.OwnerId == ownerId)
            .Select(item => item.Enquiry)
            .FirstOrDefaultAsync();
        if (enquiry == null) return NotFound(new { message = "Enquiry not found." });

        if (enquiry.Status != request.Status)
        {
            enquiry.Status = request.Status;
            _context.Notifications.Add(new Notification
            {
                UserId = enquiry.UserId,
                PropertyId = enquiry.PropertyId,
                Message = $"Your property enquiry status is now {enquiry.Status.ToLowerInvariant()}."
            });
        }
        await _context.SaveChangesAsync();
        return Ok(new { message = "Enquiry status updated.", enquiry.Status });
    }

    [Authorize(Roles = "User")]
    [HttpPost("report/{propertyId:int}")]
    public async Task<IActionResult> ReportProperty(int propertyId, PropertyReportDto request)
    {
        if (!await _context.Properties.AnyAsync(property => property.Id == propertyId))
        {
            return NotFound(new { message = "Property not found." });
        }

        _context.PropertyReports.Add(new PropertyReport
        {
            PropertyId = propertyId,
            ReporterUserId = GetUserId(),
            Category = request.Category.Trim(),
            Description = request.Description.Trim()
        });
        await _context.SaveChangesAsync();
        return Ok(new { message = "Thank you. Your report has been recorded." });
    }

    [Authorize(Roles = "User")]
    [HttpGet("favorites")]
    public async Task<IActionResult> Favorites()
    {
        var userId = GetUserId();
        return Ok(await (
            from favorite in _context.PropertyFavorites
            join property in _context.Properties on favorite.PropertyId equals property.Id
            where favorite.UserId == userId
            orderby favorite.CreatedAt descending
            select new { favorite.Id, favorite.CreatedAt, Property = property }
        ).ToListAsync());
    }

    [Authorize(Roles = "User")]
    [HttpPost("favorites/{propertyId:int}")]
    public async Task<IActionResult> AddFavorite(int propertyId)
    {
        var userId = GetUserId();
        if (!await _context.Properties.AnyAsync(property => property.Id == propertyId))
        {
            return NotFound(new { message = "Property not found." });
        }

        if (!await _context.PropertyFavorites.AnyAsync(favorite =>
                favorite.UserId == userId && favorite.PropertyId == propertyId))
        {
            _context.PropertyFavorites.Add(new PropertyFavorite
            {
                UserId = userId,
                PropertyId = propertyId
            });
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Property saved to your favorites." });
    }

    [Authorize(Roles = "User")]
    [HttpDelete("favorites/{propertyId:int}")]
    public async Task<IActionResult> RemoveFavorite(int propertyId)
    {
        var userId = GetUserId();
        var favorite = await _context.PropertyFavorites.FirstOrDefaultAsync(item =>
            item.UserId == userId && item.PropertyId == propertyId);
        if (favorite != null)
        {
            _context.PropertyFavorites.Remove(favorite);
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "Property removed from your favorites." });
    }

    [Authorize(Roles = "User")]
    [HttpPost("view/{propertyId:int}")]
    public async Task<IActionResult> RecordPropertyView(int propertyId)
    {
        if (!await _context.Properties.AnyAsync(property => property.Id == propertyId))
        {
            return NotFound(new { message = "Property not found." });
        }

        _context.PropertyViews.Add(new PropertyView
        {
            UserId = GetUserId(),
            PropertyId = propertyId
        });
        await _context.SaveChangesAsync();
        return Ok();
    }

    [Authorize(Roles = "User")]
    [HttpGet("recently-viewed")]
    public async Task<IActionResult> RecentlyViewed()
    {
        var userId = GetUserId();
        var recentViews = await _context.PropertyViews
            .Where(view => view.UserId == userId)
            .OrderByDescending(view => view.ViewedAt)
            .Take(50)
            .Select(view => new { view.PropertyId, view.ViewedAt })
            .ToListAsync();

        var uniqueViews = recentViews
            .DistinctBy(view => view.PropertyId)
            .Take(12)
            .ToList();
        var propertyIds = uniqueViews.Select(view => view.PropertyId).ToList();
        var properties = await _context.Properties
            .Where(property => propertyIds.Contains(property.Id))
            .ToDictionaryAsync(property => property.Id);

        return Ok(uniqueViews
            .Where(view => properties.ContainsKey(view.PropertyId))
            .Select(view => new
            {
                view.ViewedAt,
                Property = properties[view.PropertyId]
            }));
    }

    [Authorize(Roles = "User")]
    [HttpGet("alerts")]
    public async Task<IActionResult> PriceAndAvailabilityAlerts()
    {
        var userId = GetUserId();
        return Ok(await (
            from alert in _context.PropertyAlerts
            join property in _context.Properties on alert.PropertyId equals property.Id
            where alert.UserId == userId && alert.IsActive
            orderby alert.CreatedAt descending
            select new { alert.Id, alert.CreatedAt, Property = property }
        ).ToListAsync());
    }

    [Authorize(Roles = "User")]
    [HttpPost("alerts/{propertyId:int}")]
    public async Task<IActionResult> CreatePriceAndAvailabilityAlert(int propertyId)
    {
        var userId = GetUserId();
        if (!await _context.Properties.AnyAsync(property => property.Id == propertyId))
        {
            return NotFound(new { message = "Property not found." });
        }

        if (!await _context.PropertyAlerts.AnyAsync(alert =>
                alert.UserId == userId && alert.PropertyId == propertyId && alert.IsActive))
        {
            _context.PropertyAlerts.Add(new PropertyAlert
            {
                UserId = userId,
                PropertyId = propertyId
            });
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "You will be notified if the rent drops or the home becomes available again." });
    }

    [Authorize(Roles = "User")]
    [HttpDelete("alerts/{propertyId:int}")]
    public async Task<IActionResult> RemovePriceAndAvailabilityAlert(int propertyId)
    {
        var userId = GetUserId();
        var alerts = await _context.PropertyAlerts
            .Where(alert => alert.UserId == userId && alert.PropertyId == propertyId && alert.IsActive)
            .ToListAsync();
        _context.PropertyAlerts.RemoveRange(alerts);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Price and availability alert removed." });
    }

    [HttpGet("my-interests")]
    public async Task<IActionResult> MyInterests()
    {
        var userId = GetUserId();
        var interests = await (
            from interest in _context.PropertyInterests
            join property in _context.Properties on interest.PropertyId equals property.Id
            where interest.UserId == userId
            orderby interest.CreatedAt descending
            select new { interest.Id, interest.CreatedAt, interest.Status, Property = property }
        ).ToListAsync();

        return Ok(interests);
    }

    [HttpGet("owner-interests")]
    [Authorize(Roles = "Owner")]
    public async Task<IActionResult> OwnerInterests()
    {
        var ownerId = GetUserId();
        var interests = await (
            from interest in _context.PropertyInterests
            join property in _context.Properties on interest.PropertyId equals property.Id
            join user in _context.Users on interest.UserId equals user.Id
            where interest.OwnerId == ownerId
            orderby interest.CreatedAt descending
            select new
            {
                interest.Id,
                interest.CreatedAt,
                interest.Status,
                Property = property,
                User = new { user.FullName, user.Email, user.PhoneNumber }
            }
        ).ToListAsync();

        return Ok(interests);
    }

    [HttpGet("notifications")]
    public async Task<IActionResult> Notifications()
    {
        var userId = GetUserId();
        return Ok(await _context.Notifications
            .Where(n => n.UserId == userId)
            .OrderByDescending(n => n.CreatedAt)
            .ToListAsync());
    }

    [HttpGet("chat/{propertyId:int}")]
    public async Task<IActionResult> Chat(int propertyId)
    {
        var userId = GetUserId();
        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null || !property.OwnerId.HasValue) return NotFound(new { message = "Property owner not found." });

        return Ok(await _context.ChatMessages
            .Where(message => message.PropertyId == propertyId &&
                ((message.SenderId == userId && message.ReceiverId == property.OwnerId) ||
                 (message.SenderId == property.OwnerId && message.ReceiverId == userId)))
            .OrderBy(message => message.CreatedAt)
            .ToListAsync());
    }

    [HttpPost("chat/{propertyId:int}")]
    public async Task<IActionResult> SendChat(int propertyId, [FromBody] ChatRequest request)
    {
        var userId = GetUserId();
        var property = await _context.Properties.FindAsync(propertyId);
        if (property == null || !property.OwnerId.HasValue) return NotFound(new { message = "Property owner not found." });
        if (string.IsNullOrWhiteSpace(request.Message)) return BadRequest(new { message = "Message cannot be empty." });

        var receiverId = User.IsInRole("Owner") ? await GetInterestedUserId(propertyId, userId) : property.OwnerId.Value;
        if (receiverId == null) return BadRequest(new { message = "Show interest before starting a chat." });

        var chat = new ChatMessage { PropertyId = propertyId, SenderId = userId, ReceiverId = receiverId.Value, Message = request.Message.Trim() };
        _context.ChatMessages.Add(chat);
        await _context.SaveChangesAsync();
        return Ok(chat);
    }

    private async Task<int?> GetInterestedUserId(int propertyId, int ownerId)
    {
        return await _context.PropertyInterests
            .Where(i => i.PropertyId == propertyId && i.OwnerId == ownerId)
            .Select(i => (int?)i.UserId)
            .FirstOrDefaultAsync();
    }

    private int GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId) ? userId : throw new UnauthorizedAccessException();
    }

    public class ChatRequest
    {
        public string Message { get; set; } = string.Empty;
    }

    public class EnquiryStatusRequest
    {
        public string Status { get; set; } = string.Empty;
    }
}