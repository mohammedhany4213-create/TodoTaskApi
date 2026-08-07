namespace TodoApi.DTOs.Auth ;

public class AuthResponseDto
{
    public string Token {get; set;} = string.Empty ;

    public DateTime Expiration {get; set;}
}