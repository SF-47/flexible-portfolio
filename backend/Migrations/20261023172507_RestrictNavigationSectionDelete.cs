using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Portfolio.Api.Migrations
{
    /// <inheritdoc />
    public partial class RestrictNavigationSectionDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NavigationItems_Sections_SectionId",
                table: "NavigationItems");

            migrationBuilder.AddForeignKey(
                name: "FK_NavigationItems_Sections_SectionId",
                table: "NavigationItems",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_NavigationItems_Sections_SectionId",
                table: "NavigationItems");

            migrationBuilder.AddForeignKey(
                name: "FK_NavigationItems_Sections_SectionId",
                table: "NavigationItems",
                column: "SectionId",
                principalTable: "Sections",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }
    }
}
