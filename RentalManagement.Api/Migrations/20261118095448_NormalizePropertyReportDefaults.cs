using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RentalManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class NormalizePropertyReportDefaults : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql(
                "UPDATE [PropertyReports] SET [Status] = N'Pending', [AdminNote] = N'' " +
                "WHERE ([Status] = N'' OR [Status] IS NULL) AND ([AdminNote] = N'Pending' OR [AdminNote] = N'')");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
