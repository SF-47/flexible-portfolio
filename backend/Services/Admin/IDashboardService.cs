using backend.DTOs.Admin;

namespace backend.Services.Admin;

public interface IDashboardService
{
    Task<DashboardStatsResponse> GetStatsAsync();
}
