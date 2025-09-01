using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Swtitching_StaffProfileId_To_String : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffId",
                table: "Procedures");

            migrationBuilder.DropForeignKey(
                name: "FK_StaffProfiles_AspNetUsers_StaffMemberId",
                table: "StaffProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StaffProfiles",
                table: "StaffProfiles");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "StaffProfiles");

            migrationBuilder.RenameColumn(
                name: "StaffMemberId",
                table: "StaffProfiles",
                newName: "UserId");

            migrationBuilder.RenameIndex(
                name: "IX_StaffProfiles_StaffMemberId",
                table: "StaffProfiles",
                newName: "IX_StaffProfiles_UserId");

            migrationBuilder.RenameColumn(
                name: "Id",
                table: "OwnerAccount",
                newName: "Temporal");

            migrationBuilder.AddColumn<string>(
                name: "Temporal",
                table: "StaffProfiles",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AlterColumn<string>(
                name: "StaffId",
                table: "Procedures",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "StaffId",
                table: "Prescriptions",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<string>(
                name: "StaffId",
                table: "Appointments",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StaffProfiles",
                table: "StaffProfiles",
                column: "Temporal");

            migrationBuilder.AddForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffId",
                table: "Appointments",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffId",
                table: "Prescriptions",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffId",
                table: "Procedures",
                column: "StaffId",
                principalTable: "StaffProfiles",
                principalColumn: "Temporal",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_StaffProfiles_AspNetUsers_UserId",
                table: "StaffProfiles",
                column: "UserId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Appointments_StaffProfiles_StaffId",
                table: "Appointments");

            migrationBuilder.DropForeignKey(
                name: "FK_Prescriptions_StaffProfiles_StaffId",
                table: "Prescriptions");

            migrationBuilder.DropForeignKey(
                name: "FK_Procedures_StaffProfiles_StaffId",
                table: "Procedures");

            migrationBuilder.DropForeignKey(
                name: "FK_StaffProfiles_AspNetUsers_UserId",
                table: "StaffProfiles");

            migrationBuilder.DropPrimaryKey(
                name: "PK_StaffProfiles",
                table: "StaffProfiles");

            migrationBuilder.DropColumn(
                name: "Temporal",
                table: "StaffProfiles");

            migrationBuilder.RenameColumn(
                name: "UserId",
                table: "StaffProfiles",
                newName: "StaffMemberId");

            migrationBuilder.RenameIndex(
                name: "IX_StaffProfiles_UserId",
                table: "StaffProfiles",
                newName: "IX_StaffProfiles_StaffMemberId");

            migrationBuilder.RenameColumn(
                name: "Temporal",
                table: "OwnerAccount",
                newName: "Id");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "StaffProfiles",
                type: "int",
                nullable: false,
                defaultValue: 0)
                .Annotation("SqlServer:Identity", "1, 1");

            migrationBuilder.AlterColumn<int>(
                name: "StaffId",
                table: "Procedures",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "StaffId",
                table: "Prescriptions",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AlterColumn<int>(
                name: "StaffId",
                table: "Appointments",
                type: "int",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(450)");

            migrationBuilder.AddPrimaryKey(
                name: "PK_StaffProfiles",
                table: "StaffProfiles",
                column: "Id");

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

            migrationBuilder.AddForeignKey(
                name: "FK_StaffProfiles_AspNetUsers_StaffMemberId",
                table: "StaffProfiles",
                column: "StaffMemberId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
