using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;
using System.Security.Cryptography;

namespace RentalManagement.Api.Services;

public class VerificationService : IVerificationService
{
    private readonly AppDbContext _context;

    public VerificationService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<(bool Success, string Message, string? Code)>
        SendVerificationCodeAsync(SendVerificationDto dto)
    {
        var existingVerification = await _context.EmailVerifications
            .FirstOrDefaultAsync(v => v.Email == dto.Email);

        if (existingVerification != null)
        {
            _context.EmailVerifications.Remove(existingVerification);
        }

        var code = RandomNumberGenerator
            .GetInt32(100000, 1000000)
            .ToString();

        var verification = new EmailVerification
        {
            Email = dto.Email,
            Code = code,
            ExpiresAt = DateTime.UtcNow.AddMinutes(10),
            IsVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        _context.EmailVerifications.Add(verification);

        await _context.SaveChangesAsync();

        return (
            true,
            "Verification code generated successfully.",
            code
        );
    }

    public async Task<(bool Success, string Message)>
        VerifyEmailAsync(VerifyEmailDto dto)
    {
        var verification = await _context.EmailVerifications
            .FirstOrDefaultAsync(v =>
                v.Email == dto.Email &&
                v.Code == dto.Code);

        if (verification == null)
        {
            return (
                false,
                "Invalid verification code."
            );
        }

        if (verification.ExpiresAt < DateTime.UtcNow)
        {
            return (
                false,
                "Verification code has expired."
            );
        }

        verification.IsVerified = true;

        await _context.SaveChangesAsync();

        return (
            true,
            "Email verified successfully."
        );
    }
}