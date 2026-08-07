using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs.Tasks;

public class UpdateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [MaxLength(500)]
    public string Description { get; set; } = string.Empty ;

    public bool IsCompleted { get; set; }

    public DateTime? DueDate { get; set; }
}