namespace backend.DTOs.Navigation;

public record AdminNavigationItemResponse(
    int Id,
    string Label,
    string LinkType,
    Guid? SectionId,
    string? Url,
    int SortOrder,
    bool IsVisible,
    bool OpenInNewTab
);

// Admins only choose visibility and order. An existing link is identified by Id; its name
// and destination are never taken from the request. A link without an Id is created for the
// predefined section SectionId, with its name and destination decided by the server.
public record NavigationItemRequest(int? Id, Guid? SectionId, bool IsVisible);

// Every existing link, in the new order, plus any predefined section being added to the menu.
public record UpdateNavigationRequest(List<NavigationItemRequest> Items);
