using System.Collections.Concurrent;

namespace backend.Services.Auth;

// Counts failed sign-ins per e-mail and per IP in a fixed window. In memory, so it resets on
// restart and is per instance. Behind the Next.js server the IP is the BFF's until forwarded
// headers are configured, which is why the IP limit is much higher than the e-mail limit.
public sealed class LoginAttemptTracker
{
    public const int MaxFailuresPerEmail = 5;
    public const int MaxFailuresPerIp = 30;
    public static readonly TimeSpan Window = TimeSpan.FromMinutes(15);

    private const int MaxEntries = 10_000;

    private readonly ConcurrentDictionary<string, Entry> _entries = new();
    private readonly TimeProvider _time;

    public LoginAttemptTracker(TimeProvider time)
    {
        _time = time;
    }

    // How long the caller must wait, or null when the attempt may proceed.
    public TimeSpan? GetRetryAfter(string email, string ip)
    {
        var emailWait = RetryAfter(EmailKey(email), MaxFailuresPerEmail);
        var ipWait = RetryAfter(IpKey(ip), MaxFailuresPerIp);

        return emailWait is null ? ipWait
            : ipWait is null ? emailWait
            : emailWait > ipWait ? emailWait
            : ipWait;
    }

    public void RegisterFailure(string email, string ip)
    {
        Prune();
        Increment(EmailKey(email));
        Increment(IpKey(ip));
    }

    public void RegisterSuccess(string email) => _entries.TryRemove(EmailKey(email), out _);

    private static string EmailKey(string email) => "email:" + email.Trim().ToLowerInvariant();

    private static string IpKey(string ip) => "ip:" + ip;

    private TimeSpan? RetryAfter(string key, int limit)
    {
        if (!_entries.TryGetValue(key, out var entry))
            return null;

        var remaining = entry.WindowStart + Window - _time.GetUtcNow();

        return remaining > TimeSpan.Zero && entry.Count >= limit ? remaining : null;
    }

    private void Increment(string key)
    {
        var now = _time.GetUtcNow();

        _entries.AddOrUpdate(
            key,
            _ => new Entry(1, now),
            (_, existing) =>
                now - existing.WindowStart >= Window
                    ? new Entry(1, now)
                    : existing with { Count = existing.Count + 1 }
        );
    }

    private void Prune()
    {
        if (_entries.Count < MaxEntries)
            return;

        var now = _time.GetUtcNow();

        foreach (var pair in _entries)
        {
            if (now - pair.Value.WindowStart >= Window)
                _entries.TryRemove(pair.Key, out _);
        }
    }

    private sealed record Entry(int Count, DateTimeOffset WindowStart);
}
