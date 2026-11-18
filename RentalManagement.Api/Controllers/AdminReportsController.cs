using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/admin/reports")]
[Authorize(Roles = "Admin")]
public class AdminReportsController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminReportsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetReports(string? status)
    {
        var query =
            from report in _context.PropertyReports
            join property in _context.Properties on report.PropertyId equals property.Id
            join reporter in _context.Users on report.ReporterUserId equals reporter.Id
            select new
            {
                report.Id,
                report.Category,
                report.Description,
                report.Status,
                report.AdminNote,
                report.CreatedAt,
                report.ReviewedAt,
                Property = new { property.Id, property.Title, property.Location },
                Reporter = new { reporter.FullName, reporter.Email }
            };

        if (!string.IsNullOrWhiteSpace(status))
        {
            query = query.Where(report => report.Status == status);
        }

        return Ok(await query
            .OrderBy(report => report.Status == "Pending" ? 0 : 1)
            .ThenByDescending(report => report.CreatedAt)
            .ToListAsync());
    }

    [HttpPatch("{reportId:int}")]
    public async Task<IActionResult> UpdateReport(int reportId, UpdatePropertyReportDto request)
    {
        if (request.Status is not ("Reviewed" or "Dismissed" or "HideListing" or "RestoreListing"))
        {
            return BadRequest(new { message = "Choose Reviewed, Dismissed, HideListing, or RestoreListing." });
        }

        var report = await _context.PropertyReports.FindAsync(reportId);
        if (report == null) return NotFound(new { message = "Report not found." });

        var property = await _context.Properties.FindAsync(report.PropertyId);
        if (property == null) return NotFound(new { message = "The reported property no longer exists." });

        if (report.Status == "ListingHidden" && request.Status != "RestoreListing")
        {
            return BadRequest(new { message = "Restore the hidden listing before changing this report's resolution." });
        }

        if (request.Status == "HideListing")
        {
            property.IsPublished = false;
            report.Status = "ListingHidden";
        }
        else if (request.Status == "RestoreListing")
        {
            if (report.Status != "ListingHidden")
            {
                return BadRequest(new { message = "This report did not hide the listing." });
            }

            report.Status = "Reviewed";
            property.IsPublished = !await _context.PropertyReports.AnyAsync(other =>
                other.Id != report.Id &&
                other.PropertyId == report.PropertyId &&
                other.Status == "ListingHidden");
        }
        else
        {
            report.Status = request.Status;
        }
        report.AdminNote = request.AdminNote?.Trim() ?? string.Empty;
        report.ReviewedAt = DateTime.UtcNow;
        report.ReviewedByAdminId = GetAdminId();
        await _context.SaveChangesAsync();

        return Ok(new { message = "Report status updated.", report.Status });
    }

    private int GetAdminId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var adminId)
            ? adminId
            : throw new UnauthorizedAccessException("Admin identity is missing.");
    }
}
