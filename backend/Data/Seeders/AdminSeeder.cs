using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Data.Seeders;

public static class AdminSeeder
{
    public static async Task SeedAsync(
        AppDbContext db,
        string fullName,
        string email,
        string password
    )
    {
        email = email.Trim().ToLowerInvariant();

        var exists = await db.AdminUsers.AnyAsync(x => x.Email == email);

        if (exists)
        {
            Console.WriteLine("Admin already exists.");
            return;
        }

        var admin = new AdminUser
        {
            FullName = fullName.Trim(),
            Email = email,
            IsActive = true,
        };

        var hasher = new PasswordHasher<AdminUser>();

        admin.PasswordHash = hasher.HashPassword(admin, password);

        db.AdminUsers.Add(admin);
        await db.SaveChangesAsync();

        Console.WriteLine("Administrator created successfully.");
    }
}
