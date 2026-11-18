using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace RentalManagement.Api.Migrations
{
    /// <inheritdoc />
    public partial class SeedInitialNewsArticles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "NewsArticles",
                keyColumn: "Id",
                keyValue: 1);

            migrationBuilder.DeleteData(
                table: "NewsArticles",
                keyColumn: "Id",
                keyValue: 2);

            migrationBuilder.DeleteData(
                table: "NewsArticles",
                keyColumn: "Id",
                keyValue: 3);

            migrationBuilder.DeleteData(
                table: "NewsArticles",
                keyColumn: "Id",
                keyValue: 4);

            migrationBuilder.DeleteData(
                table: "NewsArticles",
                keyColumn: "Id",
                keyValue: 5);
        }
    }
}
