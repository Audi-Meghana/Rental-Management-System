using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.Models;

public class Property
{
    public int Id { get; set; }

    public int? OwnerId { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Location { get; set; } = string.Empty;

    [MaxLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    public decimal Rent { get; set; }

    public string Description { get; set; } = string.Empty;

    public int Bedrooms { get; set; }

    public bool IsAvailable { get; set; }

    public string ImageUrl { get; set; } = string.Empty;

    public string ImageUrls { get; set; } = string.Empty;
}