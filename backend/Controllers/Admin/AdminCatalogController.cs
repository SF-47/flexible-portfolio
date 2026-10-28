using backend.DTOs.CompanyServices;
using backend.DTOs.Projects;
using backend.Services.CompanyServices;
using backend.Services.Projects;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

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
    public async Task<IActionResult> GetServices()
    {
        var services = await _services.GetAllAsync();
        return Ok(services);
    }

    [HttpPut("services")]
    public async Task<IActionResult> SaveServices([FromBody] UpdateServicesRequest request)
    {
        var services = await _services.SaveAsync(request);
        return Ok(services);
    }

    [HttpGet("projects")]
    public async Task<IActionResult> GetProjects()
    {
        var projects = await _projects.GetAllAdminAsync();
        return Ok(projects);
    }

    [HttpPut("projects")]
    public async Task<IActionResult> SaveProjects([FromBody] UpdateProjectsRequest request)
    {
        var projects = await _projects.SaveAsync(request);
        return Ok(projects);
    }
}
