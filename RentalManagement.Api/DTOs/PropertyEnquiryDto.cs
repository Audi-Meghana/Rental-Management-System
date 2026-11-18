using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class PropertyEnquiryDto
{
    [Required, NotBlank, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, NotBlank, Phone, MaxLength(15)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, NotBlank, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    public DateTime? PreferredVisitDate { get; set; }

    [MaxLength(20)]
    public string? PreferredVisitTime { get; set; }

    [Range(1, 50)]
    public int NumberOfOccupants { get; set; } = 1;

    [Required, NotBlank, MaxLength(2000)]
    public string Message { get; set; } = string.Empty;
}

public class PropertyReportDto
{
    [Required, NotBlank, MaxLength(60)]
    public string Category { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(2000)]
    public string Description { get; set; } = string.Empty;
}

public sealed class NotBlankAttribute : ValidationAttribute
{
    public NotBlankAttribute()
        : base("{0} cannot contain only whitespace.")
    {
    }

    public override bool IsValid(object? value) =>
        value is not string text || !string.IsNullOrWhiteSpace(text);
}
