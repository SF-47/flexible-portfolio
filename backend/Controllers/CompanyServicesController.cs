using backend.Services.CompanyServices;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/company-services")]
public class CompanyServicesController : ControllerBase
{
    private readonly ICompanyServiceManager _companyServiceManager;

    public CompanyServicesController(ICompanyServiceManager companyServiceManager)
    {
        _companyServiceManager = companyServiceManager;
    }

    [HttpGet]
    public async Task<IActionResult> GetActive()
    {
        var services = await _companyServiceManager.GetActiveAsync();

        return Ok(services);
    }
}
