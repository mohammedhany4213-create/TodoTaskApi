namespace TodoApi.DTOs.Tasks;

public class TaskDto
{
    public int Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string? Description { get; set; }

    public bool IsCompleted { get; set; } = false ;

    public DateTime CreatedAt { get; set; }

    public DateTime? DueDate { get; set; }
}