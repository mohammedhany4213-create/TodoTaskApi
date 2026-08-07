using Microsoft.AspNetCore.Identity ;
using TodoApi.Data ;
using TodoApi.Models ;
using TodoApi.DTOs.Auth ;
using TodoApi.Services.Interfaces ;
using Microsoft.EntityFrameworkCore;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace TodoApi.Services ;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context ;
    private readonly PasswordHasher<User> _passwordHasher ;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
{
    _context = context;
    _configuration = configuration;
    _passwordHasher = new PasswordHasher<User>();
}

    private string GenerateToken(User user)
{
    var key = _configuration["Jwt:Key"]!;
    var securityKey = new SymmetricSecurityKey(
    Encoding.UTF8.GetBytes(key)
);
var credentials = new SigningCredentials(
    securityKey,
    SecurityAlgorithms.HmacSha256
);
var claims = new List<Claim>
{
    new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),

    new Claim(JwtRegisteredClaimNames.Email, user.Email),

    new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName)
};

var token = new JwtSecurityToken(
    issuer: _configuration["Jwt:Issuer"],
    audience: _configuration["Jwt:Audience"],
    claims: claims,
    expires: DateTime.UtcNow.AddMinutes(
        Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])
    ),
    signingCredentials: credentials
);

return new JwtSecurityTokenHandler().WriteToken(token);

}




    public async Task<AuthResponseDto> RegisterAsync(RegisterDto dto)
    {
        var existingUser = await _context.Users.
        FirstOrDefaultAsync(u => u.Email == dto.Email);
        if(existingUser != null)
        {
            throw new Exception("Email already exists");
        }
        var user = new User
{
    UserName = dto.UserName,
    Email = dto.Email
};
user.PasswordHash = _passwordHasher.HashPassword(user, dto.Password);

_context.Users.Add(user);

await _context.SaveChangesAsync();
var token = GenerateToken(user);
return new AuthResponseDto
{
    Token = token,
    Expiration = DateTime.UtcNow.AddMinutes(
        Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])
    )
};
    }




    public async Task <AuthResponseDto> LoginAsync(LoginDto dto)
    {
        var user = await _context.Users.
        FirstOrDefaultAsync(u => u.Email == dto.Email) ;

        if (user == null)
        {
            throw new Exception("Invalid email or password.");
        }

        var result = _passwordHasher.VerifyHashedPassword(
    user,
    user.PasswordHash,
    dto.Password
);
        if (result == PasswordVerificationResult.Failed)
        {
            throw new Exception("Invalid email or password.");
        }
        var token = GenerateToken(user);
        return new AuthResponseDto
        {
        Token = token,
        Expiration = DateTime.UtcNow.AddMinutes(
        Convert.ToDouble(_configuration["Jwt:DurationInMinutes"])
        )
        };
    }
}