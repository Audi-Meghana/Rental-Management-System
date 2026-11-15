using RentalManagement.Api.DTOs;

namespace RentalManagement.Api.Services;

public interface IVerificationService
{
    Task<(bool Success, string Message, string? Code)> SendVerificationCodeAsync(
        SendVerificationDto dto);

    Task<(bool Success, string Message)> VerifyEmailAsync(
        VerifyEmailDto dto);
}