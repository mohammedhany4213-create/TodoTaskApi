using System.ComponentModel.DataAnnotations ;
namespace TodoApi.DTOs.Auth ;

public class RegisterDto
{
    [Required]
    [MaxLength(100)]
    public string UserName {get; set;} = string.Empty ;

    [Required]
    [EmailAddress]
    [MaxLength(100)]
    public string Email {get;  set;} = string.Empty ;

    [Required]
    [MaxLength(8)]
    public string Password {get; set;} = string.Empty ;
}