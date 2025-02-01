using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Fixing_Staff_Prescription_Relation : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_AnimalId",
                table: "Prescriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffMemberId",
                table: "Prescriptions",
                column: "StaffMemberId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffMemberId",
                table: "Prescriptions");

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_AnimalId",
                table: "Prescriptions",
                column: "AnimalId",
                principalTable: "StaffProfiles",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
