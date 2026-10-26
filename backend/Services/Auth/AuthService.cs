using backend.Data;
using backend.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Auth;

public class AuthService : IAuthService
{
    private readonly AppDbContext _db;
    private readonly IPasswordHasher<AdminUser> _hasher;

    public AuthService(AppDbContext db, IPasswordHasher<AdminUser> hasher)
    {
        _db = db;
        _hasher = hasher;
    }

    public async Task<AdminUser?> ValidateCredentialsAsync(string email, string password)
    {
        var normalizedEmail = email.Trim().ToLowerInvariant();

        var admin = await _db.AdminUsers.FirstOrDefaultAsync(x =>
            x.Email == normalizedEmail && x.IsActive
        );

        if (admin is null)
            return null;

        var result = _hasher.VerifyHashedPassword(admin, admin.PasswordHash, password);

        if (result == PasswordVerificationResult.Failed)
            return null;

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            admin.PasswordHash = _hasher.HashPassword(admin, password);
        }

        admin.LastLoginAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();

        return admin;
    }
}
