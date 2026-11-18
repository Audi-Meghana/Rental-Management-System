namespace RentalManagement.Api.Models;

public class PropertyView
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int PropertyId { get; set; }
    public DateTime ViewedAt { get; set; } = DateTime.UtcNow;
}
