using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace parkiva_api.Migrations
{
    /// <inheritdoc />
    public partial class AddParkingTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Parkings",
                columns: table => new
                {
                    Id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    Active = table.Column<bool>(type: "boolean", nullable: false),
                    ExternalId = table.Column<int>(type: "integer", nullable: true),
                    Name = table.Column<string>(type: "text", nullable: false),
                    Latitude = table.Column<double>(type: "double precision", nullable: false),
                    Longitude = table.Column<double>(type: "double precision", nullable: false),
                    District = table.Column<string>(type: "text", nullable: false),
                    TotalSpaces = table.Column<int>(type: "integer", nullable: false),
                    AvailableSpaces = table.Column<int>(type: "integer", nullable: false),
                    FreeTime = table.Column<int>(type: "integer", nullable: false),
                    ParkType = table.Column<int>(type: "integer", nullable: false),
                    IsReservable = table.Column<bool>(type: "boolean", nullable: false),
                    PricePerHour = table.Column<decimal>(type: "numeric", nullable: false),
                    OpenHours = table.Column<string>(type: "text", nullable: false),
                    DataSource = table.Column<int>(type: "integer", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    LastSyncedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Parkings", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Parkings");
        }
    }
}
