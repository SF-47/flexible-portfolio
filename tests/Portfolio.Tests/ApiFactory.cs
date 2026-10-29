using System.Net;
using backend.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace Portfolio.Tests;

// Runs first in the pipeline and gives every request a public client address.
internal sealed class OutsideVisitorFilter : IStartupFilter
{
    public Action<IApplicationBuilder> Configure(Action<IApplicationBuilder> next)
    {
        return app =>
        {
            app.Use(
                (context, nextMiddleware) =>
                {
                    context.Connection.RemoteIpAddress = IPAddress.Parse("203.0.113.9");

                    return nextMiddleware(context);
                }
            );

            next(app);
        };
    }
}

// The real API (routing, authorization, rate limiter) on an in-memory SQLite database.
public sealed class ApiFactory : WebApplicationFactory<Program>
{
    private readonly SqliteConnection _connection = new("DataSource=:memory:");

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.UseEnvironment("Development");
        builder.UseSetting("ConnectionStrings:DefaultConnection", "Server=unused;Database=unused");

        builder.ConfigureServices(services =>
        {
            // The test server's clients are loopback, which the API trusts as its proxy. Make
            // them an ordinary outside visitor instead, so X-Forwarded-For must be ignored.
            services.AddTransient<IStartupFilter, OutsideVisitorFilter>();

            // Replace the MySQL registration with SQLite.
            var registrations = services
                .Where(service =>
                    service.ServiceType == typeof(DbContextOptions<AppDbContext>)
                    || service.ServiceType == typeof(DbContextOptions)
                    || service.ServiceType.IsGenericType
                        && service.ServiceType.GetGenericTypeDefinition().Name
                            == "IDbContextOptionsConfiguration`1"
                )
                .ToList();

            foreach (var registration in registrations)
            {
                services.Remove(registration);
            }

            _connection.Open();
            services.AddDbContext<AppDbContext>(options => options.UseSqlite(_connection));

            using var provider = services.BuildServiceProvider();
            using var scope = provider.CreateScope();
            scope.ServiceProvider.GetRequiredService<AppDbContext>().Database.EnsureCreated();
        });
    }

    protected override void Dispose(bool disposing)
    {
        base.Dispose(disposing);
        _connection.Dispose();
    }
}
