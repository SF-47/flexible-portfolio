using backend.Services.Themes;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/themes")]
public class ThemesController : ControllerBase
{
    private readonly IThemeService _themeService;

    public ThemesController(IThemeService themeService)
    {
        _themeService = themeService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var themes = await _themeService.GetAllAsync();

        return Ok(themes);
    }

    [HttpGet("active")]
    public async Task<IActionResult> GetActive()
    {
        var theme = await _themeService.GetActiveAsync();

        if (theme is null)
        {
            return NotFound(new { message = "No active theme has been configured." });
        }

        return Ok(theme);
    }
}
