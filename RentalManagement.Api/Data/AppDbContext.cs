using Microsoft.EntityFrameworkCore;
using RentalManagement.Api.Models;

namespace RentalManagement.Api.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Property> Properties { get; set; }

    public DbSet<User> Users { get; set; }

    public DbSet<EmailVerification> EmailVerifications { get; set; }

    public DbSet<PropertyInterest> PropertyInterests { get; set; }

    public DbSet<Notification> Notifications { get; set; }

    public DbSet<ChatMessage> ChatMessages { get; set; }

    public DbSet<PropertyReview> PropertyReviews { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Property>()
            .Property(p => p.Rent)
            .HasPrecision(18, 2);

        modelBuilder.Entity<User>()
            .HasIndex(u => u.Email)
            .IsUnique();

        modelBuilder.Entity<EmailVerification>()
            .HasIndex(v => v.Email);

        modelBuilder.Entity<PropertyInterest>()
            .HasIndex(i => new { i.UserId, i.PropertyId })
            .IsUnique();

        modelBuilder.Entity<Notification>()
            .HasIndex(n => n.UserId);

        modelBuilder.Entity<ChatMessage>()
            .HasIndex(c => new { c.PropertyId, c.CreatedAt });

        modelBuilder.Entity<PropertyReview>()
            .HasIndex(review => new { review.UserId, review.PropertyId })
            .IsUnique();
    }
}