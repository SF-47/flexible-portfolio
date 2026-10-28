using backend.DTOs.Navigation;
using backend.DTOs.SiteSettings;
using backend.DTOs.SocialLinks;
using backend.Services.Navigation;
using backend.Services.SiteSettings;
using backend.Services.SocialLinks;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
        var navigation = await _navigation.GetAllAsync();
        return Ok(navigation);
    }

    [HttpPut("navigation")]
    public async Task<IActionResult> UpdateNavigation([FromBody] UpdateNavigationRequest request)
    {
        var navigation = await _navigation.ReplaceAsync(request);
        return Ok(navigation);
    }

    [HttpGet("social-links")]
    public async Task<IActionResult> GetSocialLinks()
    {
        var socialLinks = await _socialLinks.GetAllAsync();
        return Ok(socialLinks);
    }

    [HttpPut("social-links")]
    public async Task<IActionResult> UpdateSocialLinks([FromBody] UpdateSocialLinksRequest request)
    {
        var socialLinks = await _socialLinks.ReplaceAsync(request);
        return Ok(socialLinks);
    }

    [HttpPut("site-settings")]
    public async Task<IActionResult> UpdateBrand([FromBody] UpdateBrandRequest request)
    {
        var settings = await _siteSettings.UpdateBrandAsync(request);

        if (settings is null)
        {
            return NotFound(new { message = "Site settings have not been configured." });
        }

        return Ok(settings);
    }
}
