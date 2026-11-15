namespace RentalManagement.Api.Models;

public class EmailVerification
{
    public int Id { get; set; }

    public string Email { get; set; } = string.Empty;

    public string Code { get; set; } = string.Empty;

    public DateTime ExpiresAt { get; set; }

    public bool IsVerified { get; set; } = false;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}