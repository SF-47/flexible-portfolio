namespace backend.DTOs.Sections;

public record SectionLayoutItem(Guid Id, bool IsVisible);

public record UpdateSectionsLayoutRequest(List<SectionLayoutItem> Sections);
