using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RentalManagement.Api.PostgresMigrations
{
    /// <inheritdoc />
    public partial class InitialPostgresSchema : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "ChatMessages",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    SenderId = table.Column<int>(type: "integer", nullable: false),
                    ReceiverId = table.Column<int>(type: "integer", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ChatMessages", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "EmailVerifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "text", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    ExpiresAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    IsVerified = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_EmailVerifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsArticles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Title = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Slug = table.Column<string>(type: "character varying(200)", maxLength: 200, nullable: false),
                    Summary = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    Content = table.Column<string>(type: "text", nullable: false),
                    Category = table.Column<string>(type: "character varying(50)", maxLength: 50, nullable: false),
                    ImageUrl = table.Column<string>(type: "character varying(500)", maxLength: 500, nullable: false),
                    IsFeatured = table.Column<bool>(type: "boolean", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    PublishedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsArticles", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "NewsSubscriptions",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    SubscribedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NewsSubscriptions", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Notifications",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: true),
                    Message = table.Column<string>(type: "text", nullable: false),
                    IsRead = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Notifications", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Properties",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    OwnerId = table.Column<int>(type: "integer", nullable: true),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Location = table.Column<string>(type: "text", nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    Rent = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Bedrooms = table.Column<int>(type: "integer", nullable: false),
                    IsAvailable = table.Column<bool>(type: "boolean", nullable: false),
                    ImageUrl = table.Column<string>(type: "text", nullable: false),
                    ImageUrls = table.Column<string>(type: "text", nullable: false),
                    IsPublished = table.Column<bool>(type: "boolean", nullable: false),
                    PropertyType = table.Column<string>(type: "text", nullable: false),
                    Bathrooms = table.Column<int>(type: "integer", nullable: true),
                    Balconies = table.Column<int>(type: "integer", nullable: true),
                    BuiltUpArea = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    FloorNumber = table.Column<int>(type: "integer", nullable: true),
                    TotalFloors = table.Column<int>(type: "integer", nullable: true),
                    Furnishing = table.Column<string>(type: "text", nullable: false),
                    PropertyAge = table.Column<int>(type: "integer", nullable: true),
                    Facing = table.Column<string>(type: "text", nullable: false),
                    Parking = table.Column<string>(type: "text", nullable: false),
                    WaterSupply = table.Column<string>(type: "text", nullable: false),
                    Address = table.Column<string>(type: "text", nullable: false),
                    Area = table.Column<string>(type: "text", nullable: false),
                    City = table.Column<string>(type: "text", nullable: false),
                    State = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    Longitude = table.Column<decimal>(type: "numeric(10,7)", precision: 10, scale: 7, nullable: true),
                    NearbyLandmarks = table.Column<string>(type: "text", nullable: false),
                    SecurityDeposit = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    MaintenanceCharges = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    BrokerageCharges = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    AdvancePayment = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: true),
                    ElectricityCharges = table.Column<string>(type: "text", nullable: false),
                    WaterCharges = table.Column<string>(type: "text", nullable: false),
                    IsRentNegotiable = table.Column<bool>(type: "boolean", nullable: false),
                    Amenities = table.Column<string>(type: "text", nullable: false),
                    PreferredTenants = table.Column<string>(type: "text", nullable: false),
                    GenderPreference = table.Column<string>(type: "text", nullable: false),
                    PetsAllowed = table.Column<bool>(type: "boolean", nullable: true),
                    SmokingAllowed = table.Column<bool>(type: "boolean", nullable: true),
                    DrinkingAllowed = table.Column<bool>(type: "boolean", nullable: true),
                    VisitorsAllowed = table.Column<bool>(type: "boolean", nullable: true),
                    MinimumStayMonths = table.Column<int>(type: "integer", nullable: true),
                    LeaseDurationMonths = table.Column<int>(type: "integer", nullable: true),
                    NoticePeriodMonths = table.Column<int>(type: "integer", nullable: true),
                    AvailableFrom = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Properties", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyAlerts",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyAlerts", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyEnquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PreferredVisitDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    PreferredVisitTime = table.Column<string>(type: "text", nullable: false),
                    NumberOfOccupants = table.Column<int>(type: "integer", nullable: false),
                    Message = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyEnquiries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyFavorites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyFavorites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyInterests",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    OwnerId = table.Column<int>(type: "integer", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyInterests", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    ReporterUserId = table.Column<int>(type: "integer", nullable: false),
                    Category = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    AdminNote = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ReviewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    ReviewedByAdminId = table.Column<int>(type: "integer", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyReports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyReviews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    Rating = table.Column<int>(type: "integer", nullable: false),
                    CleanlinessRating = table.Column<int>(type: "integer", nullable: true),
                    LocationRating = table.Column<int>(type: "integer", nullable: true),
                    MaintenanceRating = table.Column<int>(type: "integer", nullable: true),
                    OwnerCommunicationRating = table.Column<int>(type: "integer", nullable: true),
                    Comment = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyReviews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyViews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    UserId = table.Column<int>(type: "integer", nullable: false),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyViews", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RentalTenancies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    PropertyId = table.Column<int>(type: "integer", nullable: false),
                    OwnerId = table.Column<int>(type: "integer", nullable: false),
                    RenterId = table.Column<int>(type: "integer", nullable: false),
                    MonthlyRent = table.Column<decimal>(type: "numeric(18,2)", precision: 18, scale: 2, nullable: false),
                    LeaseStartDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LeaseEndDate = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    OwnerConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    RenterConfirmed = table.Column<bool>(type: "boolean", nullable: false),
                    Status = table.Column<string>(type: "text", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    AgreementFileName = table.Column<string>(type: "text", nullable: true),
                    AgreementStorageName = table.Column<string>(type: "text", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalTenancies", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SupportTickets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    TicketCode = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    RequesterType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    Category = table.Column<string>(type: "character varying(60)", maxLength: 60, nullable: false),
                    Subject = table.Column<string>(type: "character varying(180)", maxLength: 180, nullable: false),
                    Description = table.Column<string>(type: "character varying(4000)", maxLength: 4000, nullable: false),
                    AttachmentFileName = table.Column<string>(type: "character varying(260)", maxLength: 260, nullable: false),
                    AttachmentStorageName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    AdminNote = table.Column<string>(type: "character varying(2000)", maxLength: 2000, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ResolvedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SupportTickets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    FullName = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "character varying(150)", maxLength: 150, nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    PhoneNumber = table.Column<string>(type: "character varying(15)", maxLength: 15, nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    IsEmailVerified = table.Column<bool>(type: "boolean", nullable: false),
                    Location = table.Column<string>(type: "character varying(100)", maxLength: 100, nullable: false),
                    Address = table.Column<string>(type: "character varying(250)", maxLength: 250, nullable: false),
                    ZipCode = table.Column<string>(type: "character varying(10)", maxLength: 10, nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "NewsArticles",
                columns: new[] { "Id", "Category", "Content", "CreatedAt", "ImageUrl", "IsFeatured", "IsPublished", "PublishedAt", "Slug", "Summary", "Title", "UpdatedAt" },
                values: new object[,]
                {
                    { 1, "Tenant Guide", "Before you visit, confirm the rent, deposit, maintenance, availability date, and any other listed charges. Keep a written list so you can compare homes fairly.\n\nDuring the visit, check water pressure, ventilation, doors and windows, electrical outlets, mobile reception, and the condition of shared spaces. Ask which repairs will be completed before move-in.\n\nBefore paying or signing, verify who is authorized to rent the property, read the agreement carefully, and keep copies of receipts and written promises.", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85", true, true, new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "rental-home-viewing-checklist", "A focused walkthrough helps you compare homes, spot questions early, and make a more confident decision.", "A practical checklist for viewing a rental home", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 2, "Rental Tips", "Your monthly budget should include rent, maintenance, utilities, internet, and any recurring service fees. Ask the owner which utilities are included and which are billed separately.\n\nThe move-in amount can also include a security deposit, advance rent, brokerage, or agreement charges. Ask for each amount in writing and request a receipt for every payment.\n\nIf a charge is not listed or explained, clarify it before signing. A clear cost breakdown helps both tenants and owners avoid misunderstandings.", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1000&q=85", false, true, new DateTime(2026, 11, 17, 0, 0, 0, 0, DateTimeKind.Utc), "understand-rent-deposit-monthly-charges", "Look beyond monthly rent and make a simple move-in budget before you commit to a home.", "Understand rent, deposit, and monthly charges", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 3, "Owner Guide", "Start with a specific title and an honest description of the home, its location, and what is included. Add the number of bedrooms and bathrooms, built-up area, furnishing, parking, and availability when you know those details.\n\nPhotograph the exterior and each main room in good natural light. Keep images current and make sure they represent the actual property.\n\nList rent, deposit, maintenance, utility charges, tenant preferences, and house rules clearly. Responding promptly to enquiries helps prospective tenants plan their next step.", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=1000&q=85", false, true, new DateTime(2026, 11, 16, 0, 0, 0, 0, DateTimeKind.Utc), "first-time-owner-clear-rental-listing", "Accurate details, useful photos, and clear rental terms help the right tenants understand your property.", "Preparing a clear rental listing as a first-time owner", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 4, "Legal & Agreements", "Confirm the start and end dates, monthly rent, due date, deposit amount, and how the deposit will be returned. Check how rent increases, maintenance, utility bills, and repairs are handled.\n\nAsk about notice periods, renewal, visitors, pets, parking, and any restrictions that matter to your household. Ensure verbal promises are included in writing when appropriate.\n\nRead every section before signing, confirm that names and property details are accurate, and keep a signed copy for your records.", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1000&q=85", false, true, new DateTime(2026, 11, 15, 0, 0, 0, 0, DateTimeKind.Utc), "questions-before-signing-rental-agreement", "Review the practical terms with the owner before you sign and keep a copy of the final agreement.", "Questions to ask before signing a rental agreement", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc) },
                    { 5, "Tenant Guide", "Before move-in, walk through the property with the owner and note any existing marks or repairs. Take dated photos of the rooms, appliances, meters, and keys handed over.\n\nConfirm how to contact the owner or building manager for urgent repairs. Record meter readings and keep copies of the agreement, payment receipts, and inventory list.\n\nA short written handover record gives both sides a clear starting point for the tenancy.", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc), "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1000&q=85", false, true, new DateTime(2026, 11, 14, 0, 0, 0, 0, DateTimeKind.Utc), "simple-move-in-checklist-tenants", "Document the home’s condition and confirm the handover details before moving your belongings in.", "A simple move-in checklist for tenants", new DateTime(2026, 11, 18, 0, 0, 0, 0, DateTimeKind.Utc) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ChatMessages_PropertyId_CreatedAt",
                table: "ChatMessages",
                columns: new[] { "PropertyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_EmailVerifications_Email",
                table: "EmailVerifications",
                column: "Email");

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_IsPublished_PublishedAt",
                table: "NewsArticles",
                columns: new[] { "IsPublished", "PublishedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_NewsArticles_Slug",
                table: "NewsArticles",
                column: "Slug",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_NewsSubscriptions_Email",
                table: "NewsSubscriptions",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Notifications_UserId",
                table: "Notifications",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_PropertyAlerts_UserId_PropertyId_IsActive",
                table: "PropertyAlerts",
                columns: new[] { "UserId", "PropertyId", "IsActive" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyEnquiries_PropertyId_CreatedAt",
                table: "PropertyEnquiries",
                columns: new[] { "PropertyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyFavorites_UserId_PropertyId",
                table: "PropertyFavorites",
                columns: new[] { "UserId", "PropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyInterests_UserId_PropertyId",
                table: "PropertyInterests",
                columns: new[] { "UserId", "PropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyReports_PropertyId_CreatedAt",
                table: "PropertyReports",
                columns: new[] { "PropertyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyReviews_UserId_PropertyId",
                table: "PropertyReviews",
                columns: new[] { "UserId", "PropertyId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_PropertyViews_UserId_ViewedAt",
                table: "PropertyViews",
                columns: new[] { "UserId", "ViewedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_RentalTenancies_PropertyId_RenterId_Status",
                table: "RentalTenancies",
                columns: new[] { "PropertyId", "RenterId", "Status" });

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_Status_CreatedAt",
                table: "SupportTickets",
                columns: new[] { "Status", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_SupportTickets_TicketCode",
                table: "SupportTickets",
                column: "TicketCode",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ChatMessages");

            migrationBuilder.DropTable(
                name: "EmailVerifications");

            migrationBuilder.DropTable(
                name: "NewsArticles");

            migrationBuilder.DropTable(
                name: "NewsSubscriptions");

            migrationBuilder.DropTable(
                name: "Notifications");

            migrationBuilder.DropTable(
                name: "Properties");

            migrationBuilder.DropTable(
                name: "PropertyAlerts");

            migrationBuilder.DropTable(
                name: "PropertyEnquiries");

            migrationBuilder.DropTable(
                name: "PropertyFavorites");

            migrationBuilder.DropTable(
                name: "PropertyInterests");

            migrationBuilder.DropTable(
                name: "PropertyReports");

            migrationBuilder.DropTable(
                name: "PropertyReviews");

            migrationBuilder.DropTable(
                name: "PropertyViews");

            migrationBuilder.DropTable(
                name: "RentalTenancies");

            migrationBuilder.DropTable(
                name: "SupportTickets");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
