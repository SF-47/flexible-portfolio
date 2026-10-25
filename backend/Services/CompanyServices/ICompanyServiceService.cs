using backend.DTOs.CompanyServices;

namespace backend.Services.CompanyServices;

public interface ICompanyServiceManager
{
    Task<List<CompanyServiceResponse>> GetActiveAsync();

    // Admin: every service, including inactive ones.
    Task<List<AdminServiceResponse>> GetAllAsync();

    // Admin: add, edit, reorder, hide and delete in one transaction. Throws
    // ArgumentException (400) for invalid input and ConflictException (409) for stale data.
    Task<List<AdminServiceResponse>> SaveAsync(UpdateServicesRequest request);
}
