namespace backend.Services.Common;

// A request that is valid but clashes with the current data (a stale record, a duplicate
// slug…). Controllers answer it with 409.
public class ConflictException : Exception
{
    public ConflictException(string message)
        : base(message) { }
}
