using backend.Services.SiteSettings;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/site-settings")]
public class SiteSettingsController : ControllerBase
{
    private readonly ISiteSettingsService _siteSettingsService;

    public SiteSettingsController(ISiteSettingsService siteSettingsService)
    {
        _siteSettingsService = siteSettingsService;
    }

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _siteSettingsService.GetAsync();

        if (settings is null)
        {
            return NotFound(new { message = "Site settings have not been configured." });
        }

        return Ok(settings);
    }
}
