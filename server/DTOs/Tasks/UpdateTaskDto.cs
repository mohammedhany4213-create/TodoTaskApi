using System.ComponentModel.DataAnnotations;

namespace TodoApi.DTOs.Tasks;

public sealed class UpdateTaskDto
{
    [Required]
    [MaxLength(100)]
    public string Title { get; set; } = string.Empty;

    [Required]
    [MaxLength(500)]
    public string Description { get; set; } = string.Empty;

    public bool IsCompleted { get; set; }

    [CustomValidation(typeof(UpdateTaskDto), nameof(ValidateDueDate))]
    public DateTime? DueDate { get; set; }

    public static ValidationResult? ValidateDueDate(DateTime? dueDate, ValidationContext _)
    {
        if (dueDate.HasValue && dueDate.Value < DateTime.UtcNow)
            return new ValidationResult("DueDate cannot be in the past.");

        return ValidationResult.Success;
    }
}
