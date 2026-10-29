using backend.Data;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;

namespace Portfolio.Tests;

// A private in-memory SQLite database per test, so the tests never touch the real MySQL
// development database. The connection must stay open for the database to exist.
public sealed class TestDatabase : IDisposable
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    public TestDatabase()
    {
        _connection.Open();

        using var context = CreateContext();
        context.Database.EnsureCreated();
    }

    public AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>().UseSqlite(_connection).Options;

        return new AppDbContext(options);
    }

    public void Dispose()
    {
        _connection.Dispose();
    }
}
