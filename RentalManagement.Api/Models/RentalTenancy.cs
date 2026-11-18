namespace RentalManagement.Api.Models;

public class RentalTenancy
{
    public int Id { get; set; }
    public int PropertyId { get; set; }
    public int OwnerId { get; set; }
    public int RenterId { get; set; }
    public decimal MonthlyRent { get; set; }
    public DateTime LeaseStartDate { get; set; }
    public DateTime LeaseEndDate { get; set; }
    public bool OwnerConfirmed { get; set; } = true;
    public bool RenterConfirmed { get; set; }
    public string Status { get; set; } = "PendingRenterConfirmation";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ConfirmedAt { get; set; }
    public string? AgreementFileName { get; set; }
    public string? AgreementStorageName { get; set; }
}
