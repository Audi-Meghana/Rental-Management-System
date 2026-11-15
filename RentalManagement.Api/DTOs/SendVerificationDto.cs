using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class SendVerificationDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
}