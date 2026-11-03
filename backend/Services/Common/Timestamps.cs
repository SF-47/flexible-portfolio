namespace backend.Services.Common;

public static class Timestamps
{
    // MySQL returns timestamps without a "Z" (Kind Unspecified); treat them as UTC.
    public static DateTime AsUtc(DateTime value) =>
        value.Kind == DateTimeKind.Local
            ? value.ToUniversalTime()
            : DateTime.SpecifyKind(value, DateTimeKind.Utc);

    // MySQL keeps microseconds, so compare at that precision.
    public static bool SameInstant(DateTime a, DateTime b) =>
        Math.Abs((AsUtc(a) - AsUtc(b)).Ticks) < 10;
}
