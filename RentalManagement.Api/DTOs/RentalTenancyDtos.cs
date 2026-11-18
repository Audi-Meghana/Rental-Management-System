using System.ComponentModel.DataAnnotations;

namespace RentalManagement.Api.DTOs;

public class CreateRentalTenancyDto
{
    [Range(1, 1000000)]
    public decimal MonthlyRent { get; set; }

    public DateTime LeaseStartDate { get; set; }

    public DateTime LeaseEndDate { get; set; }
}

public class ConfirmRentalTenancyDto
{
    public bool Confirm { get; set; }
}

public class UpdatePropertyReportDto
{
    [Required]
    public string Status { get; set; } = string.Empty;

    [MaxLength(2000)]
    public string AdminNote { get; set; } = string.Empty;
}
