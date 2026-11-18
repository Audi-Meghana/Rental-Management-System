
using Microsoft.EntityFrameworkCore;

namespace RentalManagement.Api.Data;

public class PostgresDbContext : AppDbContext
{
    public PostgresDbContext(
        DbContextOptions<PostgresDbContext> options)
        : base(options)
    {
    }
}
