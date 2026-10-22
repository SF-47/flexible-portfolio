namespace backend.DTOs.Sections;

// ExpectedUpdatedAt is the UpdatedAt the editor loaded. If the section has changed
// since, the update is rejected (409) instead of overwriting someone else's edit.
public record UpdateSectionContentRequest(string ContentJson, DateTime? ExpectedUpdatedAt);
