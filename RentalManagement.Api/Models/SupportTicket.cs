using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.Models;

public class SupportTicket
{
    public int Id { get; set; }

    [Required, MaxLength(20)]
    public string TicketCode { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string RequesterType { get; set; } = string.Empty;

    [Required, MaxLength(100)]
    public string FullName { get; set; } = string.Empty;

    [Required, EmailAddress, MaxLength(150)]
    public string Email { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string PhoneNumber { get; set; } = string.Empty;

    [Required, MaxLength(60)]
    public string Category { get; set; } = string.Empty;

    [Required, MaxLength(180)]
    public string Subject { get; set; } = string.Empty;

    [Required, MaxLength(4000)]
    public string Description { get; set; } = string.Empty;

    [MaxLength(260)]
    public string AttachmentFileName { get; set; } = string.Empty;

    [MaxLength(100)]
    public string AttachmentStorageName { get; set; } = string.Empty;

    [Required, MaxLength(20)]
    public string Status { get; set; } = "Submitted";

    [MaxLength(2000)]
    public string AdminNote { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    public DateTime? ResolvedAt { get; set; }
}
