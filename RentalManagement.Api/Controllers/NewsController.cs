using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/news")]
public class NewsController : ControllerBase
{
    private readonly AppDbContext _context;

    public NewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetPublished(string? category, string? search)
    {
        var query = _context.NewsArticles.Where(article => article.IsPublished);
        if (!string.IsNullOrWhiteSpace(category) && category != "All News")
        {
            query = query.Where(article => article.Category == category);
        }

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            query = query.Where(article => article.Title.Contains(term) || article.Summary.Contains(term));
        }

        var articles = await query
            .OrderByDescending(article => article.IsFeatured)
            .ThenByDescending(article => article.PublishedAt)
            .Select(article => ToArticle(article))
            .ToListAsync();
        return Ok(articles);
    }

    [HttpGet("{slug}")]
    public async Task<IActionResult> GetBySlug(string slug)
    {
        var article = await _context.NewsArticles
            .Where(item => item.IsPublished && item.Slug == slug)
            .Select(item => ToArticle(item))
            .FirstOrDefaultAsync();
        return article == null ? NotFound(new { message = "News article not found." }) : Ok(article);
    }

    [HttpPost("subscribe")]
    public async Task<IActionResult> Subscribe(NewsSubscriptionDto request)
    {
        var email = request.Email.Trim().ToLowerInvariant();
        if (!await _context.NewsSubscriptions.AnyAsync(subscription => subscription.Email == email))
        {
            _context.NewsSubscriptions.Add(new NewsSubscription { Email = email });
            await _context.SaveChangesAsync();
        }

        return Ok(new { message = "You are subscribed to myHOME updates." });
    }

    private static object ToArticle(NewsArticle article) => new
    {
        article.Id,
        article.Title,
        article.Slug,
        article.Summary,
        article.Content,
        article.Category,
        article.ImageUrl,
        article.IsFeatured,
        article.PublishedAt
    };
}
