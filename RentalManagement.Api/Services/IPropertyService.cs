using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Services;

public interface IPropertyService
{
    Task<List<Property>> GetAllAsync(
        string? location,
        string? zipCode,
        decimal? minRent,
        decimal? maxRent,
        int? bedrooms,
        bool? isAvailable);

    Task<Property?> GetByIdAsync(int id);

    Task<List<Property>> GetByOwnerIdAsync(int ownerId);

    Task<Property> CreateAsync(CreatePropertyDto dto, int? ownerId = null);

    Task<Property?> UpdateAsync(
        int id,
        UpdatePropertyDto dto,
        int? ownerId = null);

    Task<bool> DeleteAsync(int id, int? ownerId = null);
}