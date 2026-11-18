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

    public DbSet<PropertyEnquiry> PropertyEnquiries { get; set; }

    public DbSet<PropertyFavorite> PropertyFavorites { get; set; }

    public DbSet<PropertyReport> PropertyReports { get; set; }

    public DbSet<PropertyView> PropertyViews { get; set; }

    public DbSet<PropertyAlert> PropertyAlerts { get; set; }

    public DbSet<RentalTenancy> RentalTenancies { get; set; }

    public DbSet<NewsArticle> NewsArticles { get; set; }

    public DbSet<NewsSubscription> NewsSubscriptions { get; set; }

    public DbSet<SupportTicket> SupportTickets { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var property = modelBuilder.Entity<Property>();
        property.Property(p => p.Rent).HasPrecision(18, 2);
        property.Property(p => p.BuiltUpArea).HasPrecision(18, 2);
        property.Property(p => p.Latitude).HasPrecision(10, 7);
        property.Property(p => p.Longitude).HasPrecision(10, 7);
        property.Property(p => p.SecurityDeposit).HasPrecision(18, 2);
        property.Property(p => p.MaintenanceCharges).HasPrecision(18, 2);
        property.Property(p => p.BrokerageCharges).HasPrecision(18, 2);
        property.Property(p => p.AdvancePayment).HasPrecision(18, 2);
        modelBuilder.Entity<RentalTenancy>()
            .Property(tenancy => tenancy.MonthlyRent)
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

        modelBuilder.Entity<PropertyEnquiry>()
            .HasIndex(enquiry => new { enquiry.PropertyId, enquiry.CreatedAt });

        modelBuilder.Entity<PropertyFavorite>()
            .HasIndex(favorite => new { favorite.UserId, favorite.PropertyId })
            .IsUnique();

        modelBuilder.Entity<PropertyReport>()
            .HasIndex(report => new { report.PropertyId, report.CreatedAt });

        modelBuilder.Entity<PropertyView>()
            .HasIndex(view => new { view.UserId, view.ViewedAt });

        modelBuilder.Entity<PropertyAlert>()
            .HasIndex(alert => new { alert.UserId, alert.PropertyId, alert.IsActive });

        modelBuilder.Entity<RentalTenancy>()
            .HasIndex(tenancy => new { tenancy.PropertyId, tenancy.RenterId, tenancy.Status });

        modelBuilder.Entity<NewsArticle>()
            .HasIndex(article => article.Slug)
            .IsUnique();

        modelBuilder.Entity<NewsArticle>()
            .HasIndex(article => new { article.IsPublished, article.PublishedAt });

        modelBuilder.Entity<NewsArticle>().HasData(
            new NewsArticle
            {
                Id = 1,
                Title = "A practical checklist for viewing a rental home",
                Slug = "rental-home-viewing-checklist",
                Summary = "A focused walkthrough helps you compare homes, spot questions early, and make a more confident decision.",
                Content = "Before you visit, confirm the rent, deposit, maintenance, availability date, and any other listed charges. Keep a written list so you can compare homes fairly.\n\nDuring the visit, check water pressure, ventilation, doors and windows, electrical outlets, mobile reception, and the condition of shared spaces. Ask which repairs will be completed before move-in.\n\nBefore paying or signing, verify who is authorized to rent the property, read the agreement carefully, and keep copies of receipts and written promises.",
                Category = "Tenant Guide",
                ImageUrl = "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
                IsFeatured = true,
                IsPublished = true,
                CreatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                PublishedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc)
            },
            new NewsArticle
            {
                Id = 2,
                Title = "Understand rent, deposit, and monthly charges",
                Slug = "understand-rent-deposit-monthly-charges",
                Summary = "Look beyond monthly rent and make a simple move-in budget before you commit to a home.",
                Content = "Your monthly budget should include rent, maintenance, utilities, internet, and any recurring service fees. Ask the owner which utilities are included and which are billed separately.\n\nThe move-in amount can also include a security deposit, advance rent, brokerage, or agreement charges. Ask for each amount in writing and request a receipt for every payment.\n\nIf a charge is not listed or explained, clarify it before signing. A clear cost breakdown helps both tenants and owners avoid misunderstandings.",
                Category = "Rental Tips",
                ImageUrl = "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=85",
                IsFeatured = false,
                IsPublished = true,
                CreatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                PublishedAt = new DateTime(2026, 11, 17, 0, 0, 0, DateTimeKind.Utc)
            },
            new NewsArticle
            {
                Id = 3,
                Title = "Preparing a clear rental listing as a first-time owner",
                Slug = "first-time-owner-clear-rental-listing",
                Summary = "Accurate details, useful photos, and clear rental terms help the right tenants understand your property.",
                Content = "Start with a specific title and an honest description of the home, its location, and what is included. Add the number of bedrooms and bathrooms, built-up area, furnishing, parking, and availability when you know those details.\n\nPhotograph the exterior and each main room in good natural light. Keep images current and make sure they represent the actual property.\n\nList rent, deposit, maintenance, utility charges, tenant preferences, and house rules clearly. Responding promptly to enquiries helps prospective tenants plan their next step.",
                Category = "Owner Guide",
                ImageUrl = "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85",
                IsFeatured = false,
                IsPublished = true,
                CreatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                PublishedAt = new DateTime(2026, 11, 16, 0, 0, 0, DateTimeKind.Utc)
            },
            new NewsArticle
            {
                Id = 4,
                Title = "Questions to ask before signing a rental agreement",
                Slug = "questions-before-signing-rental-agreement",
                Summary = "Review the practical terms with the owner before you sign and keep a copy of the final agreement.",
                Content = "Confirm the start and end dates, monthly rent, due date, deposit amount, and how the deposit will be returned. Check how rent increases, maintenance, utility bills, and repairs are handled.\n\nAsk about notice periods, renewal, visitors, pets, parking, and any restrictions that matter to your household. Ensure verbal promises are included in writing when appropriate.\n\nRead every section before signing, confirm that names and property details are accurate, and keep a signed copy for your records.",
                Category = "Legal & Agreements",
                ImageUrl = "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85",
                IsFeatured = false,
                IsPublished = true,
                CreatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                PublishedAt = new DateTime(2026, 11, 15, 0, 0, 0, DateTimeKind.Utc)
            },
            new NewsArticle
            {
                Id = 5,
                Title = "A simple move-in checklist for tenants",
                Slug = "simple-move-in-checklist-tenants",
                Summary = "Document the home’s condition and confirm the handover details before moving your belongings in.",
                Content = "Before move-in, walk through the property with the owner and note any existing marks or repairs. Take dated photos of the rooms, appliances, meters, and keys handed over.\n\nConfirm how to contact the owner or building manager for urgent repairs. Record meter readings and keep copies of the agreement, payment receipts, and inventory list.\n\nA short written handover record gives both sides a clear starting point for the tenancy.",
                Category = "Tenant Guide",
                ImageUrl = "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85",
                IsFeatured = false,
                IsPublished = true,
                CreatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                UpdatedAt = new DateTime(2026, 11, 18, 0, 0, 0, DateTimeKind.Utc),
                PublishedAt = new DateTime(2026, 11, 14, 0, 0, 0, DateTimeKind.Utc)
            }
        );

        modelBuilder.Entity<NewsSubscription>()
            .HasIndex(subscription => subscription.Email)
            .IsUnique();

        modelBuilder.Entity<SupportTicket>()
            .HasIndex(ticket => ticket.TicketCode)
            .IsUnique();

        modelBuilder.Entity<SupportTicket>()
            .HasIndex(ticket => new { ticket.Status, ticket.CreatedAt });
    }
}