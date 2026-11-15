using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
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
}