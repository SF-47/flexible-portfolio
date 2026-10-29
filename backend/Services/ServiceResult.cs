namespace backend.Services;

// The answer of a service method that can fail in an expected way (bad input, record not
// found, stale data). The controller turns it into an HTTP response:
//   Success      -> 200 with Data
//   !Success     -> StatusCode with { message = ErrorMessage }
// Unexpected errors (a database outage, a bug) are not results: they are exceptions and are
// handled by the GlobalExceptionHandler.
public class ServiceResult<T>
{
    public bool Success { get; set; }

    public T? Data { get; set; }

    public string? ErrorMessage { get; set; }

    public int StatusCode { get; set; }

    public static ServiceResult<T> Ok(T data)
    {
        return new ServiceResult<T>
        {
            Success = true,
            Data = data,
            StatusCode = 200,
        };
    }

    public static ServiceResult<T> BadRequest(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 400,
        };
    }

    public static ServiceResult<T> NotFound(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 404,
        };
    }

    public static ServiceResult<T> Conflict(string error)
    {
        return new ServiceResult<T>
        {
            Success = false,
            ErrorMessage = error,
            StatusCode = 409,
        };
    }

    // A conflict that also carries data the caller needs, for example the places that still
    // use a media image.
    public static ServiceResult<T> Conflict(string error, T data)
    {
        return new ServiceResult<T>
        {
            Success = false,
            Data = data,
            ErrorMessage = error,
            StatusCode = 409,
        };
    }
}
