using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Renaming_OwnerProfile_PK : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ProfilePicture",
                table: "OwnerProfiles");

            migrationBuilder.RenameColumn(
                name: "Temporal",
                table: "OwnerProfiles",
                newName: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Id",
                table: "OwnerProfiles",
                newName: "Temporal");

            migrationBuilder.AddColumn<byte[]>(
                name: "ProfilePicture",
                table: "OwnerProfiles",
                type: "varbinary(max)",
                nullable: true);
        }
    }
}
