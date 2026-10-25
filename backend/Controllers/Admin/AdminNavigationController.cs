using backend.DTOs.Navigation;
using backend.DTOs.SiteSettings;
using backend.DTOs.SocialLinks;
using backend.Services.Navigation;
using backend.Services.SiteSettings;
using backend.Services.SocialLinks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// Admin writes for the navbar, the footer and the brand. /api/admin is closed outside
// Development (see Program.cs) because there is no authentication yet.
[ApiController]
[Route("api/admin")]
public class AdminNavigationController : ControllerBase
{
    private readonly INavigationService _navigation;
    private readonly ISocialLinkService _socialLinks;
    private readonly ISiteSettingsService _siteSettings;

    public AdminNavigationController(
        INavigationService navigation,
        ISocialLinkService socialLinks,
        ISiteSettingsService siteSettings
    )
    {
        _navigation = navigation;
        _socialLinks = socialLinks;
        _siteSettings = siteSettings;
    }

    [HttpGet("navigation")]
    public async Task<IActionResult> GetNavigation() => Ok(await _navigation.GetAllAsync());

    [HttpPut("navigation")]
    public Task<IActionResult> UpdateNavigation([FromBody] UpdateNavigationRequest request) =>
        Run(async () => Ok(await _navigation.ReplaceAsync(request)));

    [HttpGet("social-links")]
    public async Task<IActionResult> GetSocialLinks() => Ok(await _socialLinks.GetAllAsync());

    [HttpPut("social-links")]
    public Task<IActionResult> UpdateSocialLinks([FromBody] UpdateSocialLinksRequest request) =>
        Run(async () => Ok(await _socialLinks.ReplaceAsync(request)));

    [HttpPut("site-settings")]
    public Task<IActionResult> UpdateBrand([FromBody] UpdateBrandRequest request) =>
        Run(async () =>
        {
            var settings = await _siteSettings.UpdateBrandAsync(request);

            return settings is null
                ? NotFound(new { message = "Site settings have not been configured." })
                : Ok(settings);
        });

    // Validation problems are ArgumentExceptions (400); anything else is a 500.
    private async Task<IActionResult> Run(Func<Task<IActionResult>> action)
    {
        try
        {
            return await action();
        }
        catch (ArgumentException exception)
        {
            return BadRequest(new { message = exception.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not save the changes." });
        }
    }
}
