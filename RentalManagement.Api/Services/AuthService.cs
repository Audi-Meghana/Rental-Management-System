using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using RentalManagement.Api.Data;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace RentalManagement.Api.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher;
    private readonly IConfiguration _configuration;

    public AuthService(
        AppDbContext context,
        IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
        _passwordHasher = new PasswordHasher<User>();
    }

    public async Task<(bool Success, string Message, User? User)> RegisterAsync(
        RegisterDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return (false, "Email is already registered.", null);
        }

        if (dto.Role != "User" && dto.Role != "Owner")
        {
            return (false, "Role must be User or Owner.", null);
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = dto.Role,
            Location = dto.Location,
            Address = dto.Address,
            IsEmailVerified = false,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password
        );

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        return (
            true,
            "Registration successful.",
            user
        );
    }

    public async Task<(bool Success, string Message, string? Token, User? User)> LoginAsync(
        LoginDto dto)
    {
        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (user == null)
        {
            return (
                false,
                "Invalid email or password.",
                null,
                null
            );
        }

        var passwordResult = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password
        );

        if (passwordResult == PasswordVerificationResult.Failed)
        {
            return (
                false,
                "Invalid email or password.",
                null,
                null
            );
        }

        var token = GenerateJwtToken(user);

        return (
            true,
            "Login successful.",
            token,
            user
        );
    }

    public async Task<(bool Success, string Message, string? Token, User? User)>
        CompleteUserRegistrationAsync(
            CompleteUserRegistrationDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return (
                false,
                "Email is already registered.",
                null,
                null
            );
        }

        var verification = await _context.EmailVerifications
            .FirstOrDefaultAsync(v =>
                v.Email == dto.Email &&
                v.IsVerified);

        if (verification == null)
        {
            return (
                false,
                "Please verify your email before completing registration.",
                null,
                null
            );
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = "User",
            Location = dto.Location,
            Address = dto.Address,
            IsEmailVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password
        );

        _context.Users.Add(user);

        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return (
            true,
            "User registration completed successfully.",
            token,
            user
        );
    }

    public async Task<(
        bool Success,
        string Message,
        string? Token,
        User? User,
        Property? Property
    )> CompleteOwnerRegistrationAsync(
        CompleteOwnerRegistrationDto dto)
    {
        var existingUser = await _context.Users
            .FirstOrDefaultAsync(u => u.Email == dto.Email);

        if (existingUser != null)
        {
            return (
                false,
                "Email is already registered.",
                null,
                null,
                null
            );
        }

        var verification = await _context.EmailVerifications
            .FirstOrDefaultAsync(v =>
                v.Email == dto.Email &&
                v.IsVerified);

        if (verification == null)
        {
            return (
                false,
                "Please verify your email before creating your owner account.",
                null,
                null,
                null
            );
        }

        var user = new User
        {
            FullName = dto.FullName,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            Role = "Owner",
            Location = dto.Location,
            Address = dto.Address,
            IsEmailVerified = true,
            CreatedAt = DateTime.UtcNow
        };

        user.PasswordHash = _passwordHasher.HashPassword(
            user,
            dto.Password
        );

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        var property = new Property
        {
            OwnerId = user.Id,
            Title = dto.PropertyTitle,
            Location = dto.PropertyLocation,
            ZipCode = dto.ZipCode,
            Rent = dto.Rent,
            Description = dto.Description,
            Bedrooms = dto.Bedrooms,
            IsAvailable = true
        };

        _context.Properties.Add(property);
        await _context.SaveChangesAsync();

        var token = GenerateJwtToken(user);

        return (
            true,
            "Owner account and property created successfully.",
            token,
            user,
            property
        );
    }

    private string GenerateJwtToken(User user)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is missing.");

        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer is missing.");

        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience is missing.");

        var expiresInMinutes = int.TryParse(
            _configuration["Jwt:ExpiresInMinutes"],
            out var minutes)
            ? minutes
            : 60;

        var claims = new[]
        {
            new Claim(
                ClaimTypes.NameIdentifier,
                user.Id.ToString()
            ),

            new Claim(
                ClaimTypes.Name,
                user.FullName
            ),

            new Claim(
                ClaimTypes.Email,
                user.Email
            ),

            new Claim(
                ClaimTypes.Role,
                user.Role
            )
        };

        var securityKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(key)
        );

        var credentials = new SigningCredentials(
            securityKey,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: DateTime.UtcNow.AddMinutes(expiresInMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler()
            .WriteToken(token);
    }
}