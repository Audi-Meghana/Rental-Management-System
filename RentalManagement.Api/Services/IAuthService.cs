using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Services;

public interface IAuthService
{
    Task<(bool Success, string Message, User? User)> RegisterAsync(
        RegisterDto dto);

    Task<(bool Success, string Message, string? Token, User? User)> LoginAsync(
        LoginDto dto);

    Task<(bool Success, string Message, string? Token, User? User)>
        CompleteUserRegistrationAsync(
            CompleteUserRegistrationDto dto);

    Task<(bool Success, string Message, string? Token, User? User, Property? Property)>
        CompleteOwnerRegistrationAsync(
            CompleteOwnerRegistrationDto dto);
}