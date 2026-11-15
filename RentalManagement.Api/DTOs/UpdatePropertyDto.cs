using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class UpdatePropertyDto
{
    [Required]
    public string Title { get; set; } = string.Empty;

    [Required]
    public string Location { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    [Range(1, 1000000)]
    public decimal Rent { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;

    [Range(1, 20)]
    public int Bedrooms { get; set; }

    public bool IsAvailable { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string ImageUrls { get; set; } = string.Empty;
}