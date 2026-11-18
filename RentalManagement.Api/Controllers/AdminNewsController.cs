using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/admin/news")]
[Authorize(Roles = "Admin")]
public class AdminNewsController : ControllerBase
{
    private static readonly string[] Categories =
    [
        "Rental Tips", "Market Trends", "Platform Updates", "Owner Guide", "Tenant Guide", "Legal & Agreements"
    ];

    private readonly AppDbContext _context;

    public AdminNewsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetArticles()
    {
        return Ok(await _context.NewsArticles
            .OrderByDescending(article => article.UpdatedAt)
            .Select(article => new
            {
                article.Id,
                article.Title,
                article.Slug,
                article.Summary,
                article.Content,
                article.Category,
                article.ImageUrl,
                article.IsFeatured,
                article.IsPublished,
                article.CreatedAt,
                article.UpdatedAt,
                article.PublishedAt
            })
            .ToListAsync());
    }

    [HttpPost]
    public async Task<IActionResult> CreateArticle(NewsArticleDto request)
    {
        if (!Categories.Contains(request.Category))
        {
            return BadRequest(new { message = "Choose a supported news category." });
        }

        var now = DateTime.UtcNow;
        var article = new NewsArticle
        {
            Title = request.Title.Trim(),
            Slug = await CreateUniqueSlugAsync(request.Title),
            Summary = request.Summary.Trim(),
            Content = request.Content.Trim(),
            Category = request.Category,
            ImageUrl = request.ImageUrl.Trim(),
            IsFeatured = request.IsFeatured,
            IsPublished = request.IsPublished,
            CreatedAt = now,
            UpdatedAt = now,
            PublishedAt = request.IsPublished ? now : null
        };
        _context.NewsArticles.Add(article);
        await _context.SaveChangesAsync();
        return Ok(new { message = "News article saved.", article.Id, article.Slug });
    }

    [HttpPut("{articleId:int}")]
    public async Task<IActionResult> UpdateArticle(int articleId, NewsArticleDto request)
    {
        if (!Categories.Contains(request.Category))
        {
            return BadRequest(new { message = "Choose a supported news category." });
        }

        var article = await _context.NewsArticles.FindAsync(articleId);
        if (article == null) return NotFound(new { message = "News article not found." });

        if (!string.Equals(article.Title, request.Title.Trim(), StringComparison.Ordinal))
        {
            article.Slug = await CreateUniqueSlugAsync(request.Title, article.Id);
        }

        article.Title = request.Title.Trim();
        article.Summary = request.Summary.Trim();
        article.Content = request.Content.Trim();
        article.Category = request.Category;
        article.ImageUrl = request.ImageUrl.Trim();
        article.IsFeatured = request.IsFeatured;
        if (request.IsPublished && !article.IsPublished)
        {
            article.PublishedAt = DateTime.UtcNow;
        }
        else if (!request.IsPublished)
        {
            article.PublishedAt = null;
        }
        article.IsPublished = request.IsPublished;
        article.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(new { message = "News article updated.", article.Slug });
    }

    [HttpDelete("{articleId:int}")]
    public async Task<IActionResult> DeleteArticle(int articleId)
    {
        var article = await _context.NewsArticles.FindAsync(articleId);
        if (article == null) return NotFound(new { message = "News article not found." });

        _context.NewsArticles.Remove(article);
        await _context.SaveChangesAsync();
        return Ok(new { message = "News article deleted." });
    }

    private async Task<string> CreateUniqueSlugAsync(string title, int? exceptId = null)
    {
        var baseSlug = Slugify(title);
        var slug = baseSlug;
        var suffix = 2;
        while (await _context.NewsArticles.AnyAsync(article =>
                   article.Slug == slug && (!exceptId.HasValue || article.Id != exceptId.Value)))
        {
            slug = $"{baseSlug}-{suffix++}";
        }

        return slug;
    }

    private static string Slugify(string title)
    {
        var slug = new string(title.Trim().ToLowerInvariant()
            .Select(character => char.IsLetterOrDigit(character) ? character : '-')
            .ToArray());
        while (slug.Contains("--", StringComparison.Ordinal)) slug = slug.Replace("--", "-", StringComparison.Ordinal);
        return slug.Trim('-') is { Length: > 0 } normalized ? normalized : "article";
    }
}
