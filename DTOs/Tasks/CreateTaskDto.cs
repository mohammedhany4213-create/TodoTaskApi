using System.ComponentModel.DataAnnotations ;
namespace TodoApi.DTOs.Tasks;

public class CreateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title {get; set;} = string.Empty ;

    [Required]
    [MaxLength(500)]
    public string Description {get; set;} = string.Empty ;

    public bool IsCompleted {get; set;} = false ;

    public DateTime CreatedAt { get; set; }
    public DateTime? DueDate {get; set;}
}
