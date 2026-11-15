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
        bool? isAvailable)
    {
        var query = _context.Properties.AsQueryable();

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
            OwnerId = ownerId,
            Title = dto.Title,
            Location = dto.Location,
            ZipCode = dto.ZipCode,
            Rent = dto.Rent,
            Description = dto.Description,
            Bedrooms = dto.Bedrooms,
            IsAvailable = dto.IsAvailable,
            ImageUrl = dto.ImageUrl,
            ImageUrls = dto.ImageUrls
        };

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

        property.Title = dto.Title;
        property.Location = dto.Location;
        property.ZipCode = dto.ZipCode;
        property.Rent = dto.Rent;
        property.Description = dto.Description;
        property.Bedrooms = dto.Bedrooms;
        property.IsAvailable = dto.IsAvailable;
        property.ImageUrl = dto.ImageUrl;
        property.ImageUrls = dto.ImageUrls;

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
}