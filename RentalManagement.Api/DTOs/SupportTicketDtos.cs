using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Http;

namespace RentalManagement.Api.DTOs;

public class CreateSupportTicketDto
{
    [Required, NotBlank, MaxLength(20)]
    public string RequesterType { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, Phone, MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(60)]
    public string Category { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(180)]
    public string Subject { get; set; } = string.Empty;

    [Required, NotBlank, MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    public IFormFile? Attachment { get; set; }
}

public class UpdateSupportTicketDto
{
    [Required, NotBlank, MaxLength(20)]
    public string Status { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string AdminNote { get; set; } = string.Empty;
}
