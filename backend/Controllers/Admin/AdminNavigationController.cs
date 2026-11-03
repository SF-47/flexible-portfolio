using backend.DTOs.Navigation;
using backend.DTOs.SiteSettings;
using backend.DTOs.SocialLinks;
using backend.Services.Navigation;
using backend.Services.SiteSettings;
using backend.Services.SocialLinks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// Admin reads and saves for the navbar, the footer links and the brand.
// Everything under /api/admin requires the AdminOnly policy (see AdminAuthorization).
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
    public async Task<IActionResult> GetNavigation()
    {
        var items = await _navigation.GetAllAsync();

        return Ok(items);
    }

    [HttpPut("navigation")]
    public async Task<IActionResult> UpdateNavigation([FromBody] UpdateNavigationRequest request)
    {
        var result = await _navigation.ReplaceAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpGet("social-links")]
    public async Task<IActionResult> GetSocialLinks()
    {
        var links = await _socialLinks.GetAllAsync();

        return Ok(links);
    }

    [HttpPut("social-links")]
    public async Task<IActionResult> UpdateSocialLinks([FromBody] UpdateSocialLinksRequest request)
    {
        var result = await _socialLinks.ReplaceAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpPut("site-settings")]
    public async Task<IActionResult> UpdateBrand([FromBody] UpdateBrandRequest request)
    {
        var result = await _siteSettings.UpdateBrandAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }
}
