namespace RentalManagement.Api.Models;

public class ChatMessage
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Message { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}