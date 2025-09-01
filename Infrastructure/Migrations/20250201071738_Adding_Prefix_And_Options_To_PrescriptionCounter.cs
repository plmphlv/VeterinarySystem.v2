using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Adding_Prefix_And_Options_To_PrescriptionCounter : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Prefix",
                table: "PrescriptionCounters",
                type: "varchar(1)",
                maxLength: 1,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Separator",
                table: "PrescriptionCounters",
                type: "varchar(1)",
                maxLength: 1,
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "ShowPrefix",
                table: "PrescriptionCounters",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Prefix",
                table: "PrescriptionCounters");

            migrationBuilder.DropColumn(
                name: "Separator",
                table: "PrescriptionCounters");

            migrationBuilder.DropColumn(
                name: "ShowPrefix",
                table: "PrescriptionCounters");
        }
    }
}
