using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentalManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class ExtendPropertyDetailsAndEngagement : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CleanlinessRating",
                table: "PropertyReviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LocationRating",
                table: "PropertyReviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MaintenanceRating",
                table: "PropertyReviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "OwnerCommunicationRating",
                table: "PropertyReviews",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "AdvancePayment",
                table: "Properties",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Amenities",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Area",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "AvailableFrom",
                table: "Properties",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Balconies",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "Bathrooms",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BrokerageCharges",
                table: "Properties",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BuiltUpArea",
                table: "Properties",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "City",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "DrinkingAllowed",
                table: "Properties",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ElectricityCharges",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "Facing",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "FloorNumber",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Furnishing",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "GenderPreference",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "IsRentNegotiable",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Properties",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "LeaseDurationMonths",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Properties",
                type: "decimal(10,7)",
                precision: 10,
                scale: 7,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "MaintenanceCharges",
                table: "Properties",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "MinimumStayMonths",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "NearbyLandmarks",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "NoticePeriodMonths",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Parking",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<bool>(
                name: "PetsAllowed",
                table: "Properties",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PreferredTenants",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "PropertyAge",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PropertyType",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<decimal>(
                name: "SecurityDeposit",
                table: "Properties",
                type: "decimal(18,2)",
                precision: 18,
                scale: 2,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "SmokingAllowed",
                table: "Properties",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "State",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<int>(
                name: "TotalFloors",
                table: "Properties",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "VisitorsAllowed",
                table: "Properties",
                type: "bit",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "WaterCharges",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "WaterSupply",
                table: "Properties",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "PropertyEnquiries",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    FullName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PhoneNumber = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Email = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    PreferredVisitDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    PreferredVisitTime = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NumberOfOccupants = table.Column<int>(type: "int", nullable: false),
                    Message = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyEnquiries", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyFavorites",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyFavorites", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyReports",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    ReporterUserId = table.Column<int>(type: "int", nullable: false),
                    Category = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Description = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyReports", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PropertyViews",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<int>(type: "int", nullable: false),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    ViewedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PropertyViews", x => x.Id);
                });

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
                name: "IX_PropertyReports_PropertyId_CreatedAt",
                table: "PropertyReports",
                columns: new[] { "PropertyId", "CreatedAt" });

            migrationBuilder.CreateIndex(
                name: "IX_PropertyViews_UserId_ViewedAt",
                table: "PropertyViews",
                columns: new[] { "UserId", "ViewedAt" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "PropertyEnquiries");

            migrationBuilder.DropTable(
                name: "PropertyFavorites");

            migrationBuilder.DropTable(
                name: "PropertyReports");

            migrationBuilder.DropTable(
                name: "PropertyViews");

            migrationBuilder.DropColumn(
                name: "CleanlinessRating",
                table: "PropertyReviews");

            migrationBuilder.DropColumn(
                name: "LocationRating",
                table: "PropertyReviews");

            migrationBuilder.DropColumn(
                name: "MaintenanceRating",
                table: "PropertyReviews");

            migrationBuilder.DropColumn(
                name: "OwnerCommunicationRating",
                table: "PropertyReviews");

            migrationBuilder.DropColumn(
                name: "Address",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "AdvancePayment",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Amenities",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Area",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "AvailableFrom",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Balconies",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Bathrooms",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "BrokerageCharges",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "BuiltUpArea",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "City",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "DrinkingAllowed",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "ElectricityCharges",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Facing",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "FloorNumber",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Furnishing",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "GenderPreference",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "IsRentNegotiable",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "LeaseDurationMonths",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MaintenanceCharges",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "MinimumStayMonths",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "NearbyLandmarks",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "NoticePeriodMonths",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "Parking",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PetsAllowed",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PreferredTenants",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyAge",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "PropertyType",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "SecurityDeposit",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "SmokingAllowed",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "State",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "TotalFloors",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "VisitorsAllowed",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "WaterCharges",
                table: "Properties");

            migrationBuilder.DropColumn(
                name: "WaterSupply",
                table: "Properties");
        }
    }
}
