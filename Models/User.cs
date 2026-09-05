using System.ComponentModel.DataAnnotations;

namespace TodoApi.Models;

public sealed class User
{
    public int Id { get; set; }

    [Required]
    [MaxLength(100)]
    public string UserName { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string PasswordHash { get; set; } = string.Empty;

    public ICollection<TodoTask> Tasks { get; set; } = new List<TodoTask>();
}
