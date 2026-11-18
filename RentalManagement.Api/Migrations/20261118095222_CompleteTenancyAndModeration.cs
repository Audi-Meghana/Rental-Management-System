using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentalManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class CompleteTenancyAndModeration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AdminNote",
                table: "PropertyReports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<DateTime>(
                name: "ReviewedAt",
                table: "PropertyReports",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "ReviewedByAdminId",
                table: "PropertyReports",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "PropertyReports",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "Pending");

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Properties",
                type: "bit",
                nullable: false,
                defaultValue: true);

            migrationBuilder.CreateTable(
                name: "RentalTenancies",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    PropertyId = table.Column<int>(type: "int", nullable: false),
                    OwnerId = table.Column<int>(type: "int", nullable: false),
                    RenterId = table.Column<int>(type: "int", nullable: false),
                    MonthlyRent = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    LeaseStartDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LeaseEndDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    OwnerConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    RenterConfirmed = table.Column<bool>(type: "bit", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ConfirmedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AgreementFileName = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    AgreementStorageName = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RentalTenancies", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RentalTenancies_PropertyId_RenterId_Status",
                table: "RentalTenancies",
                columns: new[] { "PropertyId", "RenterId", "Status" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RentalTenancies");

            migrationBuilder.DropColumn(
                name: "AdminNote",
                table: "PropertyReports");

            migrationBuilder.DropColumn(
                name: "ReviewedAt",
                table: "PropertyReports");

            migrationBuilder.DropColumn(
                name: "ReviewedByAdminId",
                table: "PropertyReports");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "PropertyReports");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Properties");
        }
    }
}
