namespace backend.DTOs.SocialLinks;

public record AdminSocialLinkResponse(int Id, string Platform, string Url, int SortOrder, bool IsVisible);

// Id is null for a new link. The position in the list becomes the SortOrder.
public record SocialLinkRequest(int? Id, string Platform, string Url, bool IsVisible);

// The complete list of links: links missing from it are deleted.
public record UpdateSocialLinksRequest(List<SocialLinkRequest> Items);
