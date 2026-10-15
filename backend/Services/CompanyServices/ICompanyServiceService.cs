using backend.DTOs.CompanyServices;

namespace backend.Services.CompanyServices;

public interface ICompanyServiceManager
{
    Task<List<CompanyServiceResponse>> GetActiveAsync();
}
