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

    [CustomValidation(typeof(CreateTaskDto), nameof(ValidateDueDate))]
    public DateTime? DueDate { get; set; }

    public static ValidationResult? ValidateDueDate(DateTime? dueDate, ValidationContext _)
    {
        if (dueDate.HasValue && dueDate.Value < DateTime.UtcNow)
            return new ValidationResult("DueDate cannot be in the past.");

        return ValidationResult.Success;
    }
}
