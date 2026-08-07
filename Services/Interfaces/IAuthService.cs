using TodoApi.DTOs.Auth ;
namespace TodoApi.Services.Interfaces ;
public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterDto dto);
    Task <AuthResponseDto> LoginAsync(LoginDto dto);
}