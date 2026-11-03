namespace backend.DTOs.Admin;

public record DashboardStatsResponse(
    int TotalSections,
    int VisibleSections,
    int HiddenSections,
    int TotalProjects,
    int TotalServices,
    int TotalMessages,
    int ReadMessages,
    int UnreadMessages
);
