using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required]
    [EmailAddress]
    [MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required]
    [MinLength(6)]
    public string Password { get; set; } = string.Empty;

    [Required]
    [Compare("Password")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required]
    public string Role { get; set; } = "User";

    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;
}