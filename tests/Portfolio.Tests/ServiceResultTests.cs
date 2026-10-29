using backend.Services;

namespace Portfolio.Tests;

// Controllers answer with result.StatusCode and { message = result.ErrorMessage }, so the
// factory methods decide the HTTP status of every expected failure.
public class ServiceResultTests
{
    [Fact]
    public void Each_result_carries_its_http_status()
    {
        Assert.Equal(200, ServiceResult<int>.Ok(1).StatusCode);
        Assert.Equal(400, ServiceResult<int>.BadRequest("x").StatusCode);
        Assert.Equal(404, ServiceResult<int>.NotFound("x").StatusCode);
        Assert.Equal(409, ServiceResult<int>.Conflict("x").StatusCode);
    }

    [Fact]
    public void Conflict_can_carry_data_for_the_caller()
    {
        var result = ServiceResult<List<string>>.Conflict("In use.", ["Project A"]);

        Assert.False(result.Success);
        Assert.Equal(["Project A"], result.Data);
    }
}
