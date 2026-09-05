using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs.Tasks;

public sealed class CreateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public DateTime? DueDate { get; set; }
}
