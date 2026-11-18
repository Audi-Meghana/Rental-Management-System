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

    public bool IsPublished { get; set; } = true;

    public string PropertyType { get; set; } = "Apartment";

    public int? Bathrooms { get; set; }

    public int? Balconies { get; set; }

    public decimal? BuiltUpArea { get; set; }

    public int? FloorNumber { get; set; }

    public int? TotalFloors { get; set; }

    public string Furnishing { get; set; } = string.Empty;

    public int? PropertyAge { get; set; }

    public string Facing { get; set; } = string.Empty;

    public string Parking { get; set; } = string.Empty;

    public string WaterSupply { get; set; } = string.Empty;

    public string Address { get; set; } = string.Empty;

    public string Area { get; set; } = string.Empty;

    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    public decimal? Latitude { get; set; }

    public decimal? Longitude { get; set; }

    public string NearbyLandmarks { get; set; } = string.Empty;

    public decimal? SecurityDeposit { get; set; }

    public decimal? MaintenanceCharges { get; set; }

    public decimal? BrokerageCharges { get; set; }

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

    public int? MinimumStayMonths { get; set; }

    public int? LeaseDurationMonths { get; set; }

    public int? NoticePeriodMonths { get; set; }

    public DateTime? AvailableFrom { get; set; }
}