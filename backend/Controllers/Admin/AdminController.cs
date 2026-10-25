using backend.DTOs.Sections;
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

    [HttpPut("sections/reorder")]
    public async Task<IActionResult> ReorderSections([FromBody] ReorderSectionsRequest request)
    {
        if (request.SectionIds is null)
        {
            return BadRequest(new { message = "Section IDs are required." });
        }

        var success = await _sectionService.ReorderAsync(request.SectionIds);

        if (!success)
        {
            return BadRequest(new { message = "Provide every section ID exactly once." });
        }

        return Ok(new { message = "Sections reordered successfully." });
    }

    [HttpPut("sections/layout")]
    public async Task<IActionResult> UpdateSectionsLayout(
        [FromBody] UpdateSectionsLayoutRequest request
    )
    {
        if (request.Sections is null)
        {
            return BadRequest(new { message = "Sections are required." });
        }

        var success = await _sectionService.UpdateLayoutAsync(request.Sections);

        if (!success)
        {
            return BadRequest(new { message = "Provide every section exactly once." });
        }

        return Ok(new { message = "Sections saved successfully." });
    }

    [HttpPut("sections/{id:guid}/content")]
    public async Task<IActionResult> UpdateSectionContent(
        Guid id,
        [FromBody] UpdateSectionContentRequest request
    )
    {
        if (request is null || string.IsNullOrWhiteSpace(request.ContentJson))
        {
            return BadRequest(new { message = "Content is required." });
        }

        try
        {
            var result = await _sectionService.UpdateContentAsync(id, request);

            return result.Status switch
            {
                UpdateContentStatus.Success => Ok(result.Saved),
                UpdateContentStatus.NotFound => NotFound(new { message = result.Error }),
                UpdateContentStatus.Conflict => Conflict(new { message = result.Error }),
                _ => BadRequest(new { message = result.Error }),
            };
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not save the content." });
        }
    }
}
