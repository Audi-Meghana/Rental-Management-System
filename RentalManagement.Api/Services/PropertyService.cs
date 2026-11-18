using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Services;

public class PropertyService : IPropertyService
{
    private readonly AppDbContext _context;

    public PropertyService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<Property>> GetAllAsync(
        string? location,
        string? zipCode,
        decimal? minRent,
        decimal? maxRent,
        int? bedrooms,
        bool? isAvailable,
        string? propertyType)
    {
        var query = _context.Properties
            .Where(property => property.IsPublished)
            .AsQueryable();

        // Filter by location
        if (!string.IsNullOrWhiteSpace(location))
        {
            query = query.Where(p =>
                p.Location.Contains(location));
        }

        if (!string.IsNullOrWhiteSpace(zipCode))
        {
            query = query.Where(p => p.ZipCode == zipCode);
        }

        // Filter by minimum rent
        if (minRent.HasValue)
        {
            query = query.Where(p =>
                p.Rent >= minRent.Value);
        }

        // Filter by maximum rent
        if (maxRent.HasValue)
        {
            query = query.Where(p =>
                p.Rent <= maxRent.Value);
        }

        // Filter by bedrooms
        if (bedrooms.HasValue)
        {
            query = query.Where(p =>
                p.Bedrooms == bedrooms.Value);
        }

        if (!string.IsNullOrWhiteSpace(propertyType))
        {
            query = query.Where(p => p.PropertyType == propertyType);
        }

        // Filter by availability
        if (isAvailable.HasValue)
        {
            query = query.Where(p =>
                p.IsAvailable == isAvailable.Value);
        }

        return await query.ToListAsync();
    }

    public async Task<Property?> GetByIdAsync(int id)
    {
        return await _context.Properties.FindAsync(id);
    }

    public async Task<List<Property>> GetByOwnerIdAsync(int ownerId)
    {
        return await _context.Properties
            .Where(property => property.OwnerId == ownerId)
            .OrderByDescending(property => property.Id)
            .ToListAsync();
    }

    public async Task<Property> CreateAsync(CreatePropertyDto dto, int? ownerId = null)
    {
        var property = new Property
        {
            OwnerId = ownerId
        };
        ApplyListingFields(property, dto);

        _context.Properties.Add(property);

        await _context.SaveChangesAsync();

        return property;
    }

    public async Task<Property?> UpdateAsync(
        int id,
        UpdatePropertyDto dto,
        int? ownerId = null)
    {
        var property = await _context.Properties
            .FirstOrDefaultAsync(candidate =>
                candidate.Id == id &&
                (!ownerId.HasValue || candidate.OwnerId == ownerId));

        if (property == null)
        {
            return null;
        }

        var previousRent = property.Rent;
        var wasAvailable = property.IsAvailable;
        ApplyListingFields(property, dto);

        var priceDropped = property.Rent < previousRent;
        var becameAvailable = !wasAvailable && property.IsAvailable;
        if (priceDropped || becameAvailable)
        {
            var alerts = await _context.PropertyAlerts
                .Where(alert => alert.PropertyId == property.Id && alert.IsActive)
                .ToListAsync();
            var changes = new List<string>();
            if (priceDropped) changes.Add("the rent decreased");
            if (becameAvailable) changes.Add("the property is available again");

            foreach (var alert in alerts)
            {
                _context.Notifications.Add(new Notification
                {
                    UserId = alert.UserId,
                    PropertyId = property.Id,
                    Message = $"{property.Title}: {string.Join(" and ", changes)}."
                });
                alert.IsActive = false;
            }
        }

        await _context.SaveChangesAsync();

        return property;
    }

    public async Task<bool> DeleteAsync(int id, int? ownerId = null)
    {
        var property = await _context.Properties
            .FirstOrDefaultAsync(candidate =>
                candidate.Id == id &&
                (!ownerId.HasValue || candidate.OwnerId == ownerId));

        if (property == null)
        {
            return false;
        }

        _context.Properties.Remove(property);

        await _context.SaveChangesAsync();

        return true;
    }

    private static void ApplyListingFields(Property property, PropertyListingDto dto)
    {
        property.Title = dto.Title;
        property.Location = dto.Location;
        property.ZipCode = dto.ZipCode;
        property.Rent = dto.Rent;
        property.Description = dto.Description;
        property.Bedrooms = dto.Bedrooms;
        property.IsAvailable = dto.IsAvailable;
        property.ImageUrl = dto.ImageUrl;
        property.ImageUrls = dto.ImageUrls;
        property.PropertyType = dto.PropertyType;
        property.Bathrooms = dto.Bathrooms;
        property.Balconies = dto.Balconies;
        property.BuiltUpArea = dto.BuiltUpArea;
        property.FloorNumber = dto.FloorNumber;
        property.TotalFloors = dto.TotalFloors;
        property.Furnishing = dto.Furnishing;
        property.PropertyAge = dto.PropertyAge;
        property.Facing = dto.Facing;
        property.Parking = dto.Parking;
        property.WaterSupply = dto.WaterSupply;
        property.Address = dto.Address;
        property.Area = dto.Area;
        property.City = dto.City;
        property.State = dto.State;
        property.Latitude = dto.Latitude;
        property.Longitude = dto.Longitude;
        property.NearbyLandmarks = dto.NearbyLandmarks;
        property.SecurityDeposit = dto.SecurityDeposit;
        property.MaintenanceCharges = dto.MaintenanceCharges;
        property.BrokerageCharges = dto.BrokerageCharges;
        property.AdvancePayment = dto.AdvancePayment;
        property.ElectricityCharges = dto.ElectricityCharges;
        property.WaterCharges = dto.WaterCharges;
        property.IsRentNegotiable = dto.IsRentNegotiable;
        property.Amenities = dto.Amenities;
        property.PreferredTenants = dto.PreferredTenants;
        property.GenderPreference = dto.GenderPreference;
        property.PetsAllowed = dto.PetsAllowed;
        property.SmokingAllowed = dto.SmokingAllowed;
        property.DrinkingAllowed = dto.DrinkingAllowed;
        property.VisitorsAllowed = dto.VisitorsAllowed;
        property.MinimumStayMonths = dto.MinimumStayMonths;
        property.LeaseDurationMonths = dto.LeaseDurationMonths;
        property.NoticePeriodMonths = dto.NoticePeriodMonths;
        property.AvailableFrom = dto.AvailableFrom;
    }
}