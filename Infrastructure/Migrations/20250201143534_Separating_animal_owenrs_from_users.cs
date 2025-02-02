using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Separating_animal_owenrs_from_users : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animals_AspNetUsers_AnimalOwnerId",
                table: "Animals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_AspNetUsers_AnimalOwnerId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffMemberId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffMemberId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffMemberId",
                table: "Procedures");

            migrationBuilder.RenameColumn(
                name: "StaffMemberId",
                table: "Procedures",
                newName: "StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Procedures_StaffMemberId",
                table: "Procedures",
                newName: "IX_Procedures_StaffId");

            migrationBuilder.RenameColumn(
                name: "StaffMemberId",
                table: "Prescriptions",
                newName: "StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Prescriptions_StaffMemberId",
                table: "Prescriptions",
                newName: "IX_Prescriptions_StaffId");

            migrationBuilder.RenameColumn(
                name: "Address",
                table: "AspNetUsers",
                newName: "RefreshToken");

            migrationBuilder.RenameColumn(
                name: "StaffMemberId",
                table: "Appointments",
                newName: "StaffId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_StaffMemberId",
                table: "Appointments",
                newName: "IX_Appointments_StaffId");

            migrationBuilder.RenameColumn(
                name: "AnimalOwnerId",
                table: "Animals",
                newName: "OwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Animals_AnimalOwnerId",
                table: "Animals",
                newName: "IX_Animals_OwnerId");

            migrationBuilder.AddColumn<DateTime>(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers",
                type: "datetime2",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "OwnerAccount",
                columns: table => new
                {
                    Id = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    FirstName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    LastName = table.Column<string>(type: "nvarchar(69)", maxLength: 69, nullable: false),
                    ProfilePicture = table.Column<byte[]>(type: "varbinary(max)", nullable: true),
                    Address = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UserId = table.Column<string>(type: "nvarchar(450)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OwnerAccount", x => x.Id);
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
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_OwnerAccount_AnimalOwnerId",
                table: "Appointments",
                column: "AnimalOwnerId",
                principalTable: "OwnerAccount",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffId",
                table: "Appointments",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffId",
                table: "Prescriptions",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffId",
                table: "Procedures",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Animals_OwnerAccount_OwnerId",
                table: "Animals");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_OwnerAccount_AnimalOwnerId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffId",
                table: "Procedures");

            migrationBuilder.DropTable(
                name: "OwnerAccount");

            migrationBuilder.DropColumn(
                name: "RefreshTokenExpiryTime",
                table: "AspNetUsers");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "Procedures",
                newName: "StaffMemberId");

            migrationBuilder.RenameIndex(
                name: "IX_Procedures_StaffId",
                table: "Procedures",
                newName: "IX_Procedures_StaffMemberId");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "Prescriptions",
                newName: "StaffMemberId");

            migrationBuilder.RenameIndex(
                name: "IX_Prescriptions_StaffId",
                table: "Prescriptions",
                newName: "IX_Prescriptions_StaffMemberId");

            migrationBuilder.RenameColumn(
                name: "RefreshToken",
                table: "AspNetUsers",
                newName: "Address");

            migrationBuilder.RenameColumn(
                name: "StaffId",
                table: "Appointments",
                newName: "StaffMemberId");

            migrationBuilder.RenameIndex(
                name: "IX_Appointments_StaffId",
                table: "Appointments",
                newName: "IX_Appointments_StaffMemberId");

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Animals",
                newName: "AnimalOwnerId");

            migrationBuilder.RenameIndex(
                name: "IX_Animals_OwnerId",
                table: "Animals",
                newName: "IX_Animals_AnimalOwnerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Animals_AspNetUsers_AnimalOwnerId",
                table: "Animals",
                column: "AnimalOwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_AspNetUsers_AnimalOwnerId",
                table: "Appointments",
                column: "AnimalOwnerId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffMemberId",
                table: "Appointments",
                column: "StaffMemberId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffMemberId",
                table: "Prescriptions",
                column: "StaffMemberId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffMemberId",
                table: "Procedures",
                column: "StaffMemberId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
