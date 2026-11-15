namespace RentalManagement.Api.Models;

public class Notification
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public int? PropertyId { get; set; }
    public string Message { get; set; } = string.Empty;
    public bool IsRead { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}