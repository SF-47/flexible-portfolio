using backend.Data;
using backend.DTOs.Admin;
using Microsoft.EntityFrameworkCore;

namespace backend.Services.Admin;

public class DashboardService : IDashboardService
{
    private readonly AppDbContext _db;

    public DashboardService(AppDbContext db)
    {
        _db = db;
    }

    public async Task<DashboardStatsResponse> GetStatsAsync()
    {
        var totalSections = await _db.Sections.CountAsync();
        var visibleSections = await _db.Sections.CountAsync(s => s.IsVisible);

        var totalProjects = await _db.Projects.CountAsync();
        var totalServices = await _db.Services.CountAsync();

        var totalMessages = await _db.ContactMessages.CountAsync();
        var readMessages = await _db.ContactMessages.CountAsync(m => m.IsRead);

        return new DashboardStatsResponse(
            TotalSections: totalSections,
            VisibleSections: visibleSections,
            HiddenSections: totalSections - visibleSections,
            TotalProjects: totalProjects,
            TotalServices: totalServices,
            TotalMessages: totalMessages,
            ReadMessages: readMessages,
            UnreadMessages: totalMessages - readMessages
        );
    }
}
