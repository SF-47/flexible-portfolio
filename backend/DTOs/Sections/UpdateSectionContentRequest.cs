namespace backend.DTOs.Sections;

// ContentJson is the section content as a JSON string.
// ExpectedUpdatedAt is the UpdatedAt the admin loaded; it detects stale saves.
public record UpdateSectionContentRequest(string ContentJson, DateTime ExpectedUpdatedAt);

public record UpdateSectionContentResponse(string ContentJson, DateTime UpdatedAt);
