namespace backend.DTOs.SocialLinks;

public record SocialLinkResponse(int Id, string Platform, string Url, int SortOrder);
