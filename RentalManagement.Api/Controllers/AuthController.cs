using Microsoft.AspNetCore.Mvc;
using RentalManagement.Api.DTOs;
using RentalManagement.Api.Services;

namespace RentalManagement.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IVerificationService _verificationService;

    public AuthController(
        IAuthService authService,
        IVerificationService verificationService)
    {
        _authService = authService;
        _verificationService = verificationService;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginDto dto)
    {
        var result = await _authService.LoginAsync(dto);

        if (!result.Success)
        {
            return Unauthorized(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,
            token = result.Token,

            user = new
            {
                result.User!.Id,
                result.User.FullName,
                result.User.Email,
                result.User.PhoneNumber,
                result.User.Role,
                result.User.Location,
                result.User.Address,
                result.User.ZipCode,
                result.User.IsEmailVerified,
                result.User.CreatedAt
            }
        });
    }


    // =====================================================
    // SEND VERIFICATION CODE
    // =====================================================

    [HttpPost("send-verification")]
    public async Task<IActionResult> SendVerification(
        SendVerificationDto dto)
    {
        var result =
            await _verificationService
                .SendVerificationCodeAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,

            // Development only
            verificationCode = result.Code
        });
    }


    // =====================================================
    // VERIFY EMAIL
    // =====================================================

    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail(
        VerifyEmailDto dto)
    {
        var result =
            await _verificationService
                .VerifyEmailAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message
        });
    }


    // =====================================================
    // COMPLETE USER REGISTRATION
    // =====================================================

    [HttpPost("complete-user-registration")]
    public async Task<IActionResult> CompleteUserRegistration(
        CompleteUserRegistrationDto dto)
    {
        var result =
            await _authService
                .CompleteUserRegistrationAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,
            token = result.Token,

            user = new
            {
                result.User!.Id,
                result.User.FullName,
                result.User.Email,
                result.User.PhoneNumber,
                result.User.Role,
                result.User.Location,
                result.User.Address,
                result.User.ZipCode,
                result.User.IsEmailVerified,
                result.User.CreatedAt
            }
        });
    }

    // =====================================================
    // COMPLETE OWNER REGISTRATION
    // =====================================================

    [HttpPost("complete-owner-registration")]
    public async Task<IActionResult> CompleteOwnerRegistration(
        CompleteOwnerRegistrationDto dto)
    {
        var result =
            await _authService
                .CompleteOwnerRegistrationAsync(dto);

        if (!result.Success)
        {
            return BadRequest(new
            {
                message = result.Message
            });
        }

        return Ok(new
        {
            message = result.Message,
            token = result.Token,

            user = new
            {
                result.User!.Id,
                result.User.FullName,
                result.User.Email,
                result.User.PhoneNumber,
                result.User.Role,
                result.User.Location,
                result.User.Address,
                result.User.IsEmailVerified,
                result.User.CreatedAt
            }
        });
    }
}