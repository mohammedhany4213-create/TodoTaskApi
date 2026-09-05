using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs.Tasks;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Services;

public sealed class TaskService : ITaskService
{
    private readonly AppDbContext _context;

    public TaskService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int userId)
    {
        var task = new TodoTask
        {
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            IsCompleted = false,
            CreatedAt = DateTime.UtcNow,
            DueDate = dto.DueDate,
            UserId = userId
        };

        await _context.Tasks.AddAsync(task);
        await _context.SaveChangesAsync();

        return MapToDto(task);
    }

    public async Task<bool> DeleteTaskAsync(int id, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task is null)
            return false;

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return true;
    }

    public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId)
    {
        return await _context.Tasks
            .AsNoTracking()
            .Where(t => t.UserId == userId)
            .OrderByDescending(t => t.CreatedAt)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                DueDate = t.DueDate
            })
            .ToListAsync();
    }

    public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
    {
        return await _context.Tasks
            .AsNoTracking()
            .Where(t => t.UserId == userId && t.Id == id)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                IsCompleted = t.IsCompleted,
                CreatedAt = t.CreatedAt,
                DueDate = t.DueDate
            })
            .FirstOrDefaultAsync();
    }

    public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId)
    {
        var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

        if (task is null)
            return false;

        task.Title = dto.Title.Trim();
        task.Description = dto.Description.Trim();
        task.IsCompleted = dto.IsCompleted;
        task.DueDate = dto.DueDate;

        await _context.SaveChangesAsync();

        return true;
    }

    private static TaskDto MapToDto(TodoTask task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        IsCompleted = task.IsCompleted,
        CreatedAt = task.CreatedAt,
        DueDate = task.DueDate
    };
}
