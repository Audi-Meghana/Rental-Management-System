namespace RentalManagement.Api.Models;

public class PropertyReview
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PropertyId { get; set; }
    public int Rating { get; set; }
    public int? CleanlinessRating { get; set; }
    public int? LocationRating { get; set; }
    public int? MaintenanceRating { get; set; }
    public int? OwnerCommunicationRating { get; set; }
    public string Comment { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}