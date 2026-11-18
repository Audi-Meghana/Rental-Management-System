using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public abstract class PropertyListingDto
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

    public string PropertyType { get; set; } = "Apartment";

    [Range(0, 30)]
    public int? Bathrooms { get; set; }

    [Range(0, 20)]
    public int? Balconies { get; set; }

    [Range(0, 100000)]
    public decimal? BuiltUpArea { get; set; }

    [Range(0, 300)]
    public int? FloorNumber { get; set; }

    [Range(1, 300)]
    public int? TotalFloors { get; set; }

    public string Furnishing { get; set; } = string.Empty;

    [Range(0, 300)]
    public int? PropertyAge { get; set; }

    public string Facing { get; set; } = string.Empty;

    public string Parking { get; set; } = string.Empty;

    public string WaterSupply { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    [Range(-90, 90)]
    public decimal? Latitude { get; set; }

    [Range(-180, 180)]
    public decimal? Longitude { get; set; }

    public string NearbyLandmarks { get; set; } = string.Empty;

    [Range(0, 100000000)]
    public decimal? SecurityDeposit { get; set; }

    [Range(0, 100000000)]
    public decimal? MaintenanceCharges { get; set; }

    [Range(0, 100000000)]
    public decimal? BrokerageCharges { get; set; }

    [Range(0, 100000000)]
    public decimal? AdvancePayment { get; set; }

    public string ElectricityCharges { get; set; } = string.Empty;

    public string WaterCharges { get; set; } = string.Empty;

    public bool IsRentNegotiable { get; set; }

    public string Amenities { get; set; } = string.Empty;

    public string PreferredTenants { get; set; } = string.Empty;

    public string GenderPreference { get; set; } = string.Empty;

    public bool? PetsAllowed { get; set; }

    public bool? SmokingAllowed { get; set; }

    public bool? DrinkingAllowed { get; set; }

    public bool? VisitorsAllowed { get; set; }

    [Range(1, 120)]
    public int? MinimumStayMonths { get; set; }

    [Range(1, 120)]
    public int? LeaseDurationMonths { get; set; }

    [Range(0, 24)]
    public int? NoticePeriodMonths { get; set; }

    public DateTime? AvailableFrom { get; set; }
}
