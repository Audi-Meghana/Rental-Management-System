namespace RentalManagement.Api.Models;

public class PropertyReport
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int ReporterUserId { get; set; }
    public string Category { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Status { get; set; } = "Pending";
    public string AdminNote { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReviewedAt { get; set; }
    public int? ReviewedByAdminId { get; set; }
}
