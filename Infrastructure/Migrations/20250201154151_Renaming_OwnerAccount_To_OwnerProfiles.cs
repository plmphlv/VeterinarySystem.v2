using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Renaming_OwnerAccount_To_OwnerProfiles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animals_OwnerAccount_OwnerId",
                table: "Animals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_OwnerAccount_AnimalOwnerId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "OwnerAccount");

            migrationBuilder.CreateTable(
                name: "OwnerProfiles",
                columns: table => new
                {
                    Temporal = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    ProfilePicture = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerProfiles", x => x.Temporal);
                    table.ForeignKey(
                        name: "FK_OwnerProfiles_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OwnerProfiles_UserId",
                table: "OwnerProfiles",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Animals_OwnerProfiles_OwnerId",
                table: "Animals",
                column: "OwnerId",
                principalTable: "OwnerProfiles",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_OwnerProfiles_AnimalOwnerId",
                table: "Appointments",
                column: "AnimalOwnerId",
                principalTable: "OwnerProfiles",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animals_OwnerProfiles_OwnerId",
                table: "Animals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_OwnerProfiles_AnimalOwnerId",
                table: "Appointments");

            migrationBuilder.DropTable(
                name: "OwnerProfiles");

            migrationBuilder.CreateTable(
                name: "OwnerAccount",
                columns: table => new
                {
                    Temporal = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    FirstName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    ProfilePicture = table.Column<byte[]>(type: "varbinary(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerAccount", x => x.Temporal);
                    table.ForeignKey(
                        name: "FK_OwnerAccount_AspNetUsers_UserId",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OwnerAccount_UserId",
                table: "OwnerAccount",
                column: "UserId",
                unique: true,
                filter: "[UserId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_Animals_OwnerAccount_OwnerId",
                table: "Animals",
                column: "OwnerId",
                principalTable: "OwnerAccount",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_OwnerAccount_AnimalOwnerId",
                table: "Appointments",
                column: "AnimalOwnerId",
                principalTable: "OwnerAccount",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
