using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/admin/tickets")]
[Authorize(Roles = "Admin")]
public class AdminSupportTicketsController : ControllerBase
{
    private static readonly string[] Statuses = ["Submitted", "InReview", "Resolved", "Closed"];
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public AdminSupportTicketsController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpGet]
    public async Task<IActionResult> GetTickets(string? status)
    {
        var query = _context.SupportTickets.AsQueryable();
        if (!string.IsNullOrWhiteSpace(status) && status != "All")
        {
            query = query.Where(ticket => ticket.Status == status);
        }

        return Ok(await query.OrderBy(ticket => ticket.Status == "Submitted" ? 0 : 1)
            .ThenByDescending(ticket => ticket.CreatedAt)
            .Select(ticket => new
            {
                ticket.Id,
                ticket.TicketCode,
                ticket.RequesterType,
                ticket.FullName,
                ticket.Email,
                ticket.PhoneNumber,
                ticket.Category,
                ticket.Subject,
                ticket.Description,
                ticket.AttachmentFileName,
                HasAttachment = ticket.AttachmentStorageName != string.Empty,
                ticket.Status,
                ticket.AdminNote,
                ticket.CreatedAt,
                ticket.UpdatedAt,
                ticket.ResolvedAt
            })
            .ToListAsync());
    }

    [HttpPatch("{ticketId:int}")]
    public async Task<IActionResult> UpdateTicket(int ticketId, UpdateSupportTicketDto request)
    {
        if (!Statuses.Contains(request.Status))
        {
            return BadRequest(new { message = "Choose Submitted, InReview, Resolved, or Closed." });
        }

        var ticket = await _context.SupportTickets.FindAsync(ticketId);
        if (ticket == null) return NotFound(new { message = "Support ticket not found." });

        ticket.Status = request.Status;
        ticket.AdminNote = request.AdminNote.Trim();
        ticket.UpdatedAt = DateTime.UtcNow;
        ticket.ResolvedAt = request.Status is "Resolved" or "Closed" ? ticket.UpdatedAt : null;
        await _context.SaveChangesAsync();
        return Ok(new { message = "Support ticket updated.", ticket.Status, ticket.UpdatedAt });
    }

    [HttpGet("{ticketId:int}/attachment")]
    public async Task<IActionResult> DownloadAttachment(int ticketId)
    {
        var ticket = await _context.SupportTickets.FindAsync(ticketId);
        if (ticket == null) return NotFound(new { message = "Support ticket not found." });
        if (string.IsNullOrEmpty(ticket.AttachmentStorageName))
        {
            return NotFound(new { message = "This ticket has no attachment." });
        }

        var path = Path.Combine(_environment.ContentRootPath, "App_Data", "support-attachments", ticket.AttachmentStorageName);
        if (!System.IO.File.Exists(path)) return NotFound(new { message = "The ticket attachment is unavailable." });

        var contentType = Path.GetExtension(path).ToLowerInvariant() switch
        {
            ".pdf" => "application/pdf",
            ".png" => "image/png",
            ".webp" => "image/webp",
            _ => "image/jpeg"
        };
        return PhysicalFile(path, contentType, ticket.AttachmentFileName);
    }
}
