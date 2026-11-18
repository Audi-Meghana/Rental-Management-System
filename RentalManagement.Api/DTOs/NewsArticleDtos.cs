using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class NewsArticleDto
{
    [Required, NotBlank, MaxLength(180)]
    public string Title { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(500)]
    public string Summary { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(20000)]
    public string Content { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(50)]
    public string Category { get; set; } = string.Empty;

    [MaxLength(500)]
    public string ImageUrl { get; set; } = string.Empty;

    public bool IsFeatured { get; set; }

    public bool IsPublished { get; set; }
}

public class NewsSubscriptionDto
{
    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;
}
