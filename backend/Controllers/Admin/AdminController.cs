using backend.Services.Admin;
using backend.Services.Sections;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly IDashboardService _dashboardService;
    private readonly ISectionService _sectionService;

    public AdminController(IDashboardService dashboardService, ISectionService sectionService)
    {
        _dashboardService = dashboardService;
        _sectionService = sectionService;
    }

    [HttpGet("dashboard/stats")]
    public async Task<IActionResult> GetDashboardStats()
    {
        var stats = await _dashboardService.GetStatsAsync();
        return Ok(stats);
    }

    [HttpGet("sections")]
    public async Task<IActionResult> GetAllSections()
    {
        var sections = await _sectionService.GetAllAsync();
        return Ok(sections);
    }
}
