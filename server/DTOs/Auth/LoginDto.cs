using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs.Auth;

public sealed class LoginDto
{
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Password { get; set; } = string.Empty;
}
