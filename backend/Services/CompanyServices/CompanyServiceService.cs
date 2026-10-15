using backend.Data;
using backend.DTOs.CompanyServices;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.CompanyServices;

public class CompanyServiceManager : ICompanyServiceManager
{
    private readonly AppDbContext _context;

    public CompanyServiceManager(AppDbContext context)
    {
        _context = context;
    }

    public async Task<List<CompanyServiceResponse>> GetActiveAsync()
    {
        return await _context
            .Services.AsNoTracking()
            .Where(service => service.IsActive)
            .OrderBy(service => service.SortOrder)
            .Select(service => new CompanyServiceResponse(
                service.Id,
                service.Title,
                service.Description,
                service.IconName,
                service.ImageMediaId,
                service.SortOrder
            ))
            .ToListAsync();
    }
}
