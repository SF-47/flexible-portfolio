using backend.DTOs.CompanyServices;
using backend.DTOs.Projects;
using backend.Services.CompanyServices;
using backend.Services.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// Admin reads and saves for the service cards and the project cards.
// Everything under /api/admin requires the AdminOnly policy (see AdminAuthorization).
[ApiController]
[Route("api/admin")]
public class AdminCatalogController : ControllerBase
{
    private readonly ICompanyServiceManager _companyServiceManager;
    private readonly IProjectService _projectService;

    public AdminCatalogController(
        ICompanyServiceManager companyServiceManager,
        IProjectService projectService
    )
    {
        _companyServiceManager = companyServiceManager;
        _projectService = projectService;
    }

    [HttpGet("services")]
    public async Task<IActionResult> GetServices()
    {
        var services = await _companyServiceManager.GetAllAsync();

        return Ok(services);
    }

    [HttpPut("services")]
    public async Task<IActionResult> SaveServices([FromBody] UpdateServicesRequest request)
    {
        var result = await _companyServiceManager.SaveAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }

    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _projectService.GetAllAdminAsync();

        return Ok(projects);
    }

    [HttpPut("projects")]
    public async Task<IActionResult> SaveProjects([FromBody] UpdateProjectsRequest request)
    {
        var result = await _projectService.SaveAsync(request);

        if (!result.Success)
        {
            return StatusCode(result.StatusCode, new { message = result.ErrorMessage });
        }

        return Ok(result.Data);
    }
}
