using backend.DTOs.CompanyServices;
using backend.DTOs.Projects;
using backend.Services.Common;
using backend.Services.CompanyServices;
using backend.Services.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

// Admin writes for the service cards and the project cards. /api/admin is closed outside
// Development (see Program.cs) because there is no authentication yet.
[ApiController]
[Route("api/admin")]
public class AdminCatalogController : ControllerBase
{
    private readonly ICompanyServiceManager _services;
    private readonly IProjectService _projects;

    public AdminCatalogController(ICompanyServiceManager services, IProjectService projects)
    {
        _services = services;
        _projects = projects;
    }

    [HttpGet("services")]
    public async Task<IActionResult> GetServices() => Ok(await _services.GetAllAsync());

    [HttpPut("services")]
    public Task<IActionResult> SaveServices([FromBody] UpdateServicesRequest request) =>
        Run(async () => Ok(await _services.SaveAsync(request)));

    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects() => Ok(await _projects.GetAllAdminAsync());

    [HttpPut("projects")]
    public Task<IActionResult> SaveProjects([FromBody] UpdateProjectsRequest request) =>
        Run(async () => Ok(await _projects.SaveAsync(request)));

    // ArgumentException → 400, ConflictException → 409, anything else → 500.
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
        catch (ConflictException exception)
        {
            return Conflict(new { message = exception.Message });
        }
        catch (Exception)
        {
            return StatusCode(500, new { message = "Could not save the changes." });
        }
    }
}
