using Microsoft.AspNetCore.Identity;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TodoApi.Data;
using TodoApi.DTOs.Auth;
using TodoApi.Exceptions;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Services;

public sealed class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly PasswordHasher<User> _passwordHasher = new();
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var userName = dto.UserName.Trim();

        if (await _context.Users.AnyAsync(u => u.Email == email))
            throw new ConflictException("Email already exists.");

        var user = new User
        {
            UserName = userName,
            Email = email
        };

        user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
        _context.Users.Add(user);

        try
        {
            await _context.SaveChangesAsync();
        }
        catch (DbUpdateException ex) when (IsDuplicateKeyException(ex))
        {
            throw new ConflictException("Email already exists.");
        }

        return CreateAuthResponse(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var email = dto.Email.Trim().ToLowerInvariant();
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user is null)
            throw new UnauthorizedAccessException();

        var result = _passwordHasher.VerifyHashedPassword(
            user,
            user.PasswordHash,
            dto.Password);

        if (result == PasswordVerificationResult.Failed)
            throw new UnauthorizedAccessException();

        if (result == PasswordVerificationResult.SuccessRehashNeeded)
        {
            user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);
            await _context.SaveChangesAsync();
        }

        return CreateAuthResponse(user);
    }

    private AuthResponseDto CreateAuthResponse(User user)
    {
        var key = _configuration["Jwt:Key"]
            ?? throw new InvalidOperationException("JWT key is not configured.");
        var issuer = _configuration["Jwt:Issuer"]
            ?? throw new InvalidOperationException("JWT issuer is not configured.");
        var audience = _configuration["Jwt:Audience"]
            ?? throw new InvalidOperationException("JWT audience is not configured.");
        var duration = _configuration.GetValue<int?>("Jwt:DurationInMinutes")
            ?? throw new InvalidOperationException("JWT duration is not configured.");

        if (duration <= 0)
            throw new InvalidOperationException("JWT duration must be greater than zero.");

        var expiration = DateTime.UtcNow.AddMinutes(duration);
        var credentials = new SigningCredentials(
            new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),
            SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
        };

        var token = new JwtSecurityToken(
            issuer: issuer,
            audience: audience,
            claims: claims,
            expires: expiration,
            signingCredentials: credentials);

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Expiration = expiration
        };
    }

    private static bool IsDuplicateKeyException(DbUpdateException exception)
    {
        return exception.InnerException is SqlException sqlException
            && sqlException.Number is 2601 or 2627;
    }
}
