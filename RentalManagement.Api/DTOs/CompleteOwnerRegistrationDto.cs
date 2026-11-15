using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class CompleteOwnerRegistrationDto
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
    [Compare(nameof(Password))]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Required]
    [MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;

    [MaxLength(100)]
    public string Location { get; set; } = string.Empty;

    [MaxLength(250)]
    public string Address { get; set; } = string.Empty;

    [Required]
    [MaxLength(10)]
    public string ZipCode { get; set; } = string.Empty;

    [Required]
    public string PropertyTitle { get; set; } = string.Empty;

    [Required]
    public string PropertyLocation { get; set; } = string.Empty;

    [Range(1, 1000000)]
    public decimal Rent { get; set; }

    [Range(1, 20)]
    public int Bedrooms { get; set; }

    [Required]
    public string Description { get; set; } = string.Empty;
}