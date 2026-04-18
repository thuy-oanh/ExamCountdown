using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace JiraProject.Migrations
{
    /// <inheritdoc />
    public partial class KhoiTaoDB : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "KyThis",
                columns: table => new
                {
                    Id = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    TenKyThi = table.Column<string>(type: "TEXT", nullable: false),
                    NgayThi = table.Column<DateTime>(type: "TEXT", nullable: false),
                    TrangThai = table.Column<string>(type: "TEXT", nullable: false),
                    PhongThi = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KyThis", x => x.Id);
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "KyThis");
        }
    }
}
