using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.Models;

public class NewsArticle
{
    public int Id { get; set; }

    [Required, MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required, MaxLength(200)]
    public string Slug { get; set; } = string.Empty;

    [Required, MaxLength(500)]
    public string Summary { get; set; } = string.Empty;

    [Required]
    public string Content { get; set; } = string.Empty;

    [Required, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? PublishedAt { get; set; }
}
