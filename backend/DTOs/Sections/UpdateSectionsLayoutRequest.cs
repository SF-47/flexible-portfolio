namespace backend.DTOs.Sections;

public record SectionLayoutItem(Guid Id, bool IsVisible);

// Every section, in the desired order, with its visibility.
public record UpdateSectionsLayoutRequest(List<SectionLayoutItem> Sections);
