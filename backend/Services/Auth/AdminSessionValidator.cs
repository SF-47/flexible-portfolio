using System.Security.Claims;
using backend.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Auth;

public static class AdminSessionValidator
{
    // Runs for every request that carries the cookie: an administrator who was disabled or
    // deleted loses access immediately instead of when the cookie expires.
    public static async Task ValidateAsync(CookieValidatePrincipalContext context)
    {
        var idClaim = context.Principal?.FindFirstValue(ClaimTypes.NameIdentifier);
        var isAdmin = context.Principal?.IsInRole(AdminAuthorization.Role) == true;

        var stillActive =
            isAdmin
            && Guid.TryParse(idClaim, out var id)
            && await context
                .HttpContext.RequestServices.GetRequiredService<AppDbContext>()
                .AdminUsers.AsNoTracking()
                .AnyAsync(x => x.Id == id && x.IsActive, context.HttpContext.RequestAborted);

        if (stillActive)
            return;

        context.RejectPrincipal();
        await context.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
    }
}
