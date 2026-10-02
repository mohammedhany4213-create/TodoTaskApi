using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using OptionsWrapper = Microsoft.Extensions.Options.Options;
using TodoApi.Options;
using TodoApi.Data;
using TodoApi.DTOs.Auth;
using TodoApi.Exceptions;
using TodoApi.Services;
using Xunit;

namespace TodoApi.Tests;

public class AuthServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    private static IOptions<JwtOptions> CreateJwtOptions() =>
        OptionsWrapper.Create(new JwtOptions
        {
            Key = "this-is-a-test-secret-key-with-32+chars",
            Issuer = "TodoApi.Tests",
            Audience = "TodoApi.Tests.Users",
            DurationInMinutes = 60
        });

    [Fact]
    public async Task RegisterAsync_CreatesUser_AndReturnsToken()
    {
        await using var context = CreateContext();
        var service = new AuthService(context, CreateJwtOptions());

        var dto = new RegisterDto
        {
            UserName = "Mooo",
            Email = "  Mooo@Example.com  ",
            Password = "StrongPassword1"
        };

        var result = await service.RegisterAsync(dto);

        Assert.False(string.IsNullOrWhiteSpace(result.Token));
        Assert.True(result.Expiration > DateTime.UtcNow);
        Assert.Single(context.Users);
        Assert.Equal("mooo@example.com", context.Users.First().Email);
    }

    [Fact]
    public async Task RegisterAsync_ThrowsConflict_WhenEmailAlreadyExists()
    {
        await using var context = CreateContext();
        var service = new AuthService(context, CreateJwtOptions());

        var dto = new RegisterDto
        {
            UserName = "First",
            Email = "duplicate@example.com",
            Password = "StrongPassword1"
        };

        await service.RegisterAsync(dto);

        var secondDto = new RegisterDto
        {
            UserName = "Second",
            Email = "duplicate@example.com",
            Password = "AnotherPassword1"
        };

        await Assert.ThrowsAsync<ConflictException>(() => service.RegisterAsync(secondDto));
    }

    [Fact]
    public async Task LoginAsync_ReturnsToken_WithCorrectCredentials()
    {
        await using var context = CreateContext();
        var service = new AuthService(context, CreateJwtOptions());

        await service.RegisterAsync(new RegisterDto
        {
            UserName = "Mooo",
            Email = "login@example.com",
            Password = "StrongPassword1"
        });

        var result = await service.LoginAsync(new LoginDto
        {
            Email = "login@example.com",
            Password = "StrongPassword1"
        });

        Assert.False(string.IsNullOrWhiteSpace(result.Token));
    }

    [Fact]
    public async Task LoginAsync_Throws_WhenUserDoesNotExist()
    {
        await using var context = CreateContext();
        var service = new AuthService(context, CreateJwtOptions());

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.LoginAsync(new LoginDto { Email = "nobody@example.com", Password = "whatever" }));
    }

    [Fact]
    public async Task LoginAsync_Throws_WhenPasswordIsWrong()
    {
        await using var context = CreateContext();
        var service = new AuthService(context, CreateJwtOptions());

        await service.RegisterAsync(new RegisterDto
        {
            UserName = "Mooo",
            Email = "wrongpass@example.com",
            Password = "StrongPassword1"
        });

        await Assert.ThrowsAsync<UnauthorizedAccessException>(() =>
            service.LoginAsync(new LoginDto { Email = "wrongpass@example.com", Password = "WrongOne1" }));
    }
}