using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Passport_Number_And_Chip_Number_For_Animals : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "ChipNumber",
                table: "Animals",
                type: "varchar(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PassportNumber",
                table: "Animals",
                type: "varchar(15)",
                maxLength: 15,
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Animals_ChipNumber",
                table: "Animals",
                column: "ChipNumber",
                unique: true,
                filter: "\"ChipNumber\" IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_Animals_PassportNumber",
                table: "Animals",
                column: "PassportNumber",
                unique: true,
                filter: "\"PassportNumber\" IS NOT NULL");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Animals_ChipNumber",
                table: "Animals");

            migrationBuilder.DropIndex(
                name: "IX_Animals_PassportNumber",
                table: "Animals");

            migrationBuilder.DropColumn(
                name: "ChipNumber",
                table: "Animals");

            migrationBuilder.DropColumn(
                name: "PassportNumber",
                table: "Animals");
        }
    }
}
