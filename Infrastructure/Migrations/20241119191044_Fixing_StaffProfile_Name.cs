using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Fixing_StaffProfile_Name : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProffiles_StaffMemberId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProffiles_AnimalId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProffiles_StaffMemberId",
                table: "Procedures");

            migrationBuilder.DropTable(
                name: "StaffProffiles");

            migrationBuilder.CreateTable(
                name: "StaffProfiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffMemberId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    LastModificationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletionDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffProfiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffProfiles_AspNetUsers_StaffMemberId",
                        column: x => x.StaffMemberId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffProfiles_StaffMemberId",
                table: "StaffProfiles",
                column: "StaffMemberId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffMemberId",
                table: "Appointments",
                column: "StaffMemberId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_AnimalId",
                table: "Prescriptions",
                column: "AnimalId",
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffMemberId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_AnimalId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffMemberId",
                table: "Procedures");

            migrationBuilder.DropTable(
                name: "StaffProfiles");

            migrationBuilder.CreateTable(
                name: "StaffProffiles",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    StaffMemberId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    CreatedBy = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    CreationDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Deleted = table.Column<bool>(type: "bit", nullable: false),
                    DeletedBy = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DeletionDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModificationDate = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LastModifiedBy = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StaffProffiles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_StaffProffiles_AspNetUsers_StaffMemberId",
                        column: x => x.StaffMemberId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_StaffProffiles_StaffMemberId",
                table: "StaffProffiles",
                column: "StaffMemberId",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffProffiles_StaffMemberId",
                table: "Appointments",
                column: "StaffMemberId",
                principalTable: "StaffProffiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProffiles_AnimalId",
                table: "Prescriptions",
                column: "AnimalId",
                principalTable: "StaffProffiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Procedures_StaffProffiles_StaffMemberId",
                table: "Procedures",
                column: "StaffMemberId",
                principalTable: "StaffProffiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
