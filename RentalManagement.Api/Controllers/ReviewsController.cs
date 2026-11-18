using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/reviews")]
public class ReviewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ReviewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("property/{propertyId:int}")]
    public async Task<IActionResult> GetPropertyReviews(int propertyId)
    {
        var reviews = await (
            from review in _context.PropertyReviews
            join user in _context.Users on review.UserId equals user.Id
            where review.PropertyId == propertyId
            orderby review.CreatedAt descending
            select new
            {
                review.Id,
                review.Rating,
                review.CleanlinessRating,
                review.LocationRating,
                review.MaintenanceRating,
                review.OwnerCommunicationRating,
                review.Comment,
                review.CreatedAt,
                Reviewer = user.FullName,
                IsVerifiedRenter = _context.RentalTenancies.Any(tenancy =>
                    tenancy.PropertyId == review.PropertyId &&
                    tenancy.RenterId == review.UserId &&
                    tenancy.Status == "Confirmed" &&
                    tenancy.OwnerConfirmed &&
                    tenancy.RenterConfirmed)
            }
        ).ToListAsync();

        return Ok(reviews);
    }

    [Authorize(Roles = "User")]
    [HttpPost("property/{propertyId:int}")]
    public async Task<IActionResult> AddReview(int propertyId, ReviewRequest request)
    {
        var userId = GetUserId();

        if (request.Rating is < 1 or > 5 ||
            request.CleanlinessRating is < 1 or > 5 ||
            request.LocationRating is < 1 or > 5 ||
            request.MaintenanceRating is < 1 or > 5 ||
            request.OwnerCommunicationRating is < 1 or > 5 ||
            string.IsNullOrWhiteSpace(request.Comment))
        {
            return BadRequest(new { message = "Provide a rating from 1 to 5 for every category and a comment." });
        }

        var hasConfirmedTenancy = await _context.RentalTenancies
            .AnyAsync(tenancy =>
                tenancy.RenterId == userId &&
                tenancy.PropertyId == propertyId &&
                tenancy.Status == "Confirmed" &&
                tenancy.OwnerConfirmed &&
                tenancy.RenterConfirmed);

        if (!hasConfirmedTenancy)
        {
            return BadRequest(new { message = "Only renters with a mutually confirmed tenancy can review this property." });
        }

        var existingReview = await _context.PropertyReviews
            .FirstOrDefaultAsync(review => review.UserId == userId && review.PropertyId == propertyId);

        if (existingReview != null)
        {
            existingReview.Rating = request.Rating;
            existingReview.CleanlinessRating = request.CleanlinessRating;
            existingReview.LocationRating = request.LocationRating;
            existingReview.MaintenanceRating = request.MaintenanceRating;
            existingReview.OwnerCommunicationRating = request.OwnerCommunicationRating;
            existingReview.Comment = request.Comment.Trim();
            existingReview.CreatedAt = DateTime.UtcNow;
        }
        else
        {
            _context.PropertyReviews.Add(new PropertyReview
            {
                UserId = userId,
                PropertyId = propertyId,
                Rating = request.Rating,
                CleanlinessRating = request.CleanlinessRating,
                LocationRating = request.LocationRating,
                MaintenanceRating = request.MaintenanceRating,
                OwnerCommunicationRating = request.OwnerCommunicationRating,
                Comment = request.Comment.Trim()
            });
        }

        await _context.SaveChangesAsync();
        return Ok(new { message = "Your review has been saved." });
    }

    [HttpGet("recommended")]
    public async Task<IActionResult> GetRecommendedProperties()
    {
        var recommendations = await (
            from property in _context.Properties
            join review in _context.PropertyReviews on property.Id equals review.PropertyId
            where property.IsAvailable && property.IsPublished
            group review by new
            {
                property.Id,
                property.Title,
                property.Location,
                property.Rent,
                property.Bedrooms,
                property.ImageUrl
            }
            into grouped
            orderby grouped.Average(review => review.Rating) descending, grouped.Count() descending
            select new
            {
                grouped.Key.Id,
                grouped.Key.Title,
                grouped.Key.Location,
                grouped.Key.Rent,
                grouped.Key.Bedrooms,
                grouped.Key.ImageUrl,
                AverageRating = grouped.Average(review => review.Rating),
                ReviewCount = grouped.Count()
            }
        ).Take(6).ToListAsync();

        return Ok(recommendations);
    }

    private int GetUserId()
    {
        var claim = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return int.TryParse(claim, out var userId)
            ? userId
            : throw new UnauthorizedAccessException();
    }

    public class ReviewRequest
    {
        public int Rating { get; set; }
        public int CleanlinessRating { get; set; }
        public int LocationRating { get; set; }
        public int MaintenanceRating { get; set; }
        public int OwnerCommunicationRating { get; set; }
        public string Comment { get; set; } = string.Empty;
    }
}