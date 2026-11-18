namespace RentalManagement.Api.Models;

public class PropertyEnquiry
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int UserId { get; set; }
    public string FullName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? PreferredVisitDate { get; set; }
    public string PreferredVisitTime { get; set; } = string.Empty;
    public int NumberOfOccupants { get; set; }
    public string Message { get; set; } = string.Empty;
    public string Status { get; set; } = "New";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
