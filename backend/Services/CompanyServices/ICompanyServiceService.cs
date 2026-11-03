using backend.DTOs.CompanyServices;

namespace backend.Services.CompanyServices;

public interface ICompanyServiceManager
{
    Task<List<CompanyServiceResponse>> GetActiveAsync();

    // Admin: every service, including inactive ones.
    Task<List<AdminServiceResponse>> GetAllAsync();

    // Admin: add, edit, reorder, hide and delete in one transaction. 400 for invalid input,
    // 409 for stale data.
    Task<ServiceResult<List<AdminServiceResponse>>> SaveAsync(UpdateServicesRequest request);
}
