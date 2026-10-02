using System.Net;
using System.Net.Http.Json;

namespace TodoApi.Tests;

public sealed class ApiIntegrationTests : IClassFixture<TodoApiFactory>
{
    private readonly HttpClient _client;

    public ApiIntegrationTests(TodoApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task RegisterThenLogin_ReturnsJwt()
    {
        var register = await _client.PostAsJsonAsync("/api/Auth/register", new
        {
            userName = "integration-user",
            email = "integration@example.com",
            password = "StrongPassword1"
        });

        Assert.Equal(HttpStatusCode.OK, register.StatusCode);

        var login = await _client.PostAsJsonAsync("/api/Auth/login", new
        {
            email = "integration@example.com",
            password = "StrongPassword1"
        });

        Assert.Equal(HttpStatusCode.OK, login.StatusCode);
        var body = await login.Content.ReadFromJsonAsync<AuthResponse>();
        Assert.NotNull(body);
        Assert.False(string.IsNullOrWhiteSpace(body!.Token));
    }

    private sealed record AuthResponse(string Token, DateTime Expiration);
}
