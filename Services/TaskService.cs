using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs;
using TodoApi.DTOs.Tasks;
using TodoApi.Models;
using TodoApi.Services.Interfaces;

namespace TodoApi.Services
{
    public class TaskService : ITaskService
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
                Title = dto.Title ,
                Description  = dto.Description ,
                IsCompleted = false,
                CreatedAt = DateTime.UtcNow,
                UserId = userId
            };

            await _context.Tasks.AddAsync(task) ;
            await _context.SaveChangesAsync() ;

            return new TaskDto
            {
                Id = task.Id ,
                Title = task.Title ,
                Description = task.Description,
                IsCompleted = task.IsCompleted ,
                CreatedAt = task.CreatedAt
            };
        }

        public async Task<bool> DeleteTaskAsync(int id, int userId)
        {
            var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId);

            if(task == null)
            return false ;

            _context.Tasks.Remove(task);
            await _context.SaveChangesAsync();

            return true ;
        }

        public async Task<IEnumerable<TaskDto>> GetAllTasksAsync(int userId)
        {
            return await _context.Tasks
            .Where(t => t.UserId == userId)
            .Select(t => new TaskDto
                {
                    Id = t.Id ,
                    Title = t.Title,
                    Description = t.Description ,
                    IsCompleted = t.IsCompleted ,
                    CreatedAt = t.CreatedAt      
            }
            )
            .ToListAsync();
        }

        public async Task<TaskDto?> GetTaskByIdAsync(int id, int userId)
        {
            return await _context.Tasks
            .Where(t => t.UserId == userId && t.Id == id)
            .Select(t => new TaskDto
            {
                Id = t.Id ,
                Title = t.Title,
            Description = t.Description,
            IsCompleted = t.IsCompleted,
            CreatedAt = t.CreatedAt
            })
            .FirstOrDefaultAsync();
        }
        

        public async Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId)
        {
            var task = await _context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId );

            if(task == null)
            return false ;

            task.Title = dto.Title ;
            task.Description = dto.Description ;
            task.IsCompleted = dto.IsCompleted ;

            await _context.SaveChangesAsync();

            return true ;
            
        }
    }
}