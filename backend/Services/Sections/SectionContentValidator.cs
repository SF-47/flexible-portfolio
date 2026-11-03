using System.Text.Json;
using System.Text.RegularExpressions;

namespace backend.Services.Sections;

// Server-side check of a section's ContentJson. The rules mirror the Zod schemas in
// frontend/src/schemas/sectionSchemas.ts, so keep the two in sync. Unknown extra
// properties are allowed (and preserved); missing or wrongly typed ones are rejected.
public static class SectionContentValidator
{
    private const int MaxText = 5000;
    private const int MaxLink = 2000;

    // Links end up in <a href>, so only safe schemes are accepted (never javascript:).
    private static readonly Regex SafeLink = new(
        @"^(#|/(?!/)|https?://|mailto:|tel:)\S*$",
        RegexOptions.IgnoreCase | RegexOptions.Compiled
    );

    // A rule returns an error message, or null when the value is valid.
    // Media ids found along the way are collected so the caller can check they exist.
    private delegate string? Rule(JsonElement value, string path, List<int> mediaIds);

    private sealed record Field(string Key, Rule Rule, bool Optional = false);

    private static readonly Rule Text = (value, path, _) =>
        value.ValueKind == JsonValueKind.String && value.GetString()!.Length <= MaxText
            ? null
            : $"{path} must be text of at most {MaxText} characters.";

    private static readonly Rule Link = (value, path, _) =>
        value.ValueKind == JsonValueKind.String
        && value.GetString()!.Length <= MaxLink
        && (value.GetString() == "" || SafeLink.IsMatch(value.GetString()!))
            ? null
            : $"{path} must be empty or start with #, /, https://, mailto: or tel:.";

    // An icon is a plain Lucide name such as "ShieldCheck", only ever used as a lookup key.
    private static readonly Regex IconPattern = new(
        "^[A-Za-z][A-Za-z0-9]{0,63}$",
        RegexOptions.Compiled
    );

    private static readonly Rule Icon = (value, path, _) =>
        value.ValueKind == JsonValueKind.String && IconPattern.IsMatch(value.GetString()!)
            ? null
            : $"{path} must be an icon name such as ShieldCheck.";

    private static readonly Rule Bool = (value, path, _) =>
        value.ValueKind is JsonValueKind.True or JsonValueKind.False
            ? null
            : $"{path} must be true or false.";

    private static readonly Rule Rating = (value, path, _) =>
        value.ValueKind == JsonValueKind.Number
        && value.TryGetInt32(out var number)
        && number is >= 1 and <= 5
            ? null
            : $"{path} must be a whole number from 1 to 5.";

    // null, or the id of a MediaAsset.
    private static readonly Rule Media = (value, path, mediaIds) =>
    {
        if (value.ValueKind == JsonValueKind.Null)
        {
            return null;
        }

        if (value.ValueKind == JsonValueKind.Number && value.TryGetInt32(out var id) && id > 0)
        {
            mediaIds.Add(id);
            return null;
        }

        return $"{path} must be null or a media id.";
    };

    // A list of 1 to max items. The maximums match the public layouts; the cards of
    // Services and Projects live in their own tables, so their maximum (6) must be
    // enforced by their CRUD endpoints when those are built.
    private static Rule ListOf(int max, params Field[] fields) => CountedList(1, max, fields);

    private static Rule CountedList(int min, int max, params Field[] fields) =>
        (value, path, mediaIds) =>
        {
            if (value.ValueKind != JsonValueKind.Array)
                return $"{path} must be a list.";

            var length = value.GetArrayLength();

            if (length < min || length > max)
                return min == max
                    ? $"{path} must have exactly {min} items."
                    : $"{path} must have between {min} and {max} items.";

            var index = 0;

            foreach (var item in value.EnumerateArray())
            {
                var error = CheckObject(item, $"{path}[{index}]", fields, mediaIds);

                if (error is not null)
                {
                    return error;
                }

                index++;
            }

            return null;
        };

    private static string? CheckObject(
        JsonElement value,
        string path,
        Field[] fields,
        List<int> mediaIds
    )
    {
        if (value.ValueKind != JsonValueKind.Object)
            return $"{path} must be an object.";

        foreach (var field in fields)
        {
            if (!value.TryGetProperty(field.Key, out var property))
            {
                if (field.Optional)
                {
                    continue;
                }

                return $"{path}.{field.Key} is required.";
            }

            var error = field.Rule(property, $"{path}.{field.Key}", mediaIds);

            if (error is not null)
            {
                return error;
            }
        }

        return null;
    }

    private static Field F(string key, Rule rule) => new(key, rule);

    private static Field[] Header() => [F("label", Text), F("title", Text), F("description", Text)];

    private static Field[] Concat(Field[] header, params Field[] rest) => [.. header, .. rest];

    private static readonly Dictionary<string, Field[]> Specs = new()
    {
        ["hero"] =
        [
            F("tagline", Text),
            F("title", Text),
            F("description", Text),
            F("buttonText", Text),
            F("buttonLink", Link),
            new Field("imageMediaId", Media, Optional: true),
        ],
        ["about"] =
        [
            F("label", Text),
            F("title", Text),
            F("description", Text),
            F("secondDescription", Text),
            F("linkText", Text),
            F("linkUrl", Link),
            F("imageMediaId", Media),
            F("imageAlt", Text),
        ],
        ["stats"] = [F("items", ListOf(6, F("value", Text), F("label", Text)))],
        ["services"] = Header(),
        ["projects"] = [F("label", Text), F("title", Text)],
        ["whyChooseUs"] = Concat(
            Header(),
            F("items", ListOf(6, F("icon", Icon), F("title", Text), F("description", Text)))
        ),
        ["process"] = Concat(
            Header(),
            F(
                "steps",
                ListOf(
                    6,
                    F("number", Text),
                    F("icon", Icon),
                    F("title", Text),
                    F("description", Text)
                )
            )
        ),
        ["gallery"] = Concat(
            Header(),
            F("icon", Icon),
            F(
                "items",
                ListOf(
                    12,
                    F("title", Text),
                    F("category", Text),
                    F("imageMediaId", Media),
                    F("featured", Bool)
                )
            )
        ),
        ["team"] = Concat(
            Header(),
            F(
                "members",
                ListOf(
                    6,
                    F("name", Text),
                    F("position", Text),
                    F("description", Text),
                    F("imageMediaId", Media)
                )
            )
        ),
        ["clients"] = Concat(Header(), F("items", ListOf(6, F("name", Text), F("icon", Icon)))),
        ["testimonials"] = Concat(
            Header(),
            F(
                "items",
                ListOf(
                    6,
                    F("name", Text),
                    F("role", Text),
                    F("initials", Text),
                    F("rating", Rating),
                    F("message", Text)
                )
            )
        ),
        ["certifications"] = Concat(
            Header(),
            F(
                "items",
                ListOf(
                    6,
                    F("icon", Icon),
                    F("title", Text),
                    F("subtitle", Text),
                    F("description", Text)
                )
            )
        ),
        ["faq"] = Concat(
            Header(),
            F("helpIcon", Icon),
            F("helpTitle", Text),
            F("helpLinkText", Text),
            F("helpLinkUrl", Link),
            F("items", ListOf(5, F("question", Text), F("answer", Text)))
        ),
        ["cta"] = Concat(
            Header(),
            F("primaryButtonText", Text),
            F("primaryButtonLink", Link),
            F("secondaryButtonText", Text),
            F("secondaryButtonLink", Link)
        ),
        ["contact"] = Concat(
            Header(),
            F("addressTitle", Text),
            F("phoneTitle", Text),
            F("emailTitle", Text),
            F("nameLabel", Text),
            F("namePlaceholder", Text),
            F("emailLabel", Text),
            F("emailPlaceholder", Text),
            F("messageLabel", Text),
            F("messagePlaceholder", Text),
            F("buttonText", Text)
        ),
    };

    // The top-level keys the editor may change for a section type.
    public static IEnumerable<string> Keys(string type) =>
        Specs.TryGetValue(type, out var fields) ? fields.Select(f => f.Key) : [];

    // Returns an error message, or null when the content is valid for the section type.
    public static string? Validate(string type, JsonElement content, List<int> mediaIds)
    {
        if (!Specs.TryGetValue(type, out var fields))
            return $"Unknown section type '{type}'.";

        return CheckObject(content, "content", fields, mediaIds);
    }
}
