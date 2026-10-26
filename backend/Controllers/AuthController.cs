using System.Security.Claims;
using backend.DTOs.Auth;
using backend.Services.Auth;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [AllowAnonymous]
    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var admin = await _authService.ValidateCredentialsAsync(request.Email, request.Password);

        if (admin is null)
            return Unauthorized(new { message = "Invalid email or password." });

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, admin.Id.ToString()),
            new(ClaimTypes.Name, admin.FullName),
            new(ClaimTypes.Email, admin.Email),
            new(ClaimTypes.Role, "Admin"),
        };

        var identity = new ClaimsIdentity(
            claims,
            CookieAuthenticationDefaults.AuthenticationScheme
        );

        var principal = new ClaimsPrincipal(identity);

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

        return Ok(new AdminProfileResponse(admin.Id, admin.FullName, admin.Email));
    }

    [Authorize(Roles = "Admin")]
    [HttpGet("me")]
    public IActionResult Me()
    {
        return Ok(
            new AdminProfileResponse(
                Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier)!),
                User.Identity!.Name!,
                User.FindFirstValue(ClaimTypes.Email)!
            )
        );
    }

    [Authorize(Roles = "Admin")]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);

        return NoContent();
    }
}
