using TodoApi.DTOs.Tasks;

namespace TodoApi.Services.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTaskAsync(CreateTaskDto dto, int userId);

        Task<PagedResultDto<TaskDto>> GetAllTasksAsync(int userId, int pageNumber, int pageSize);

        Task<TaskDto?> GetTaskByIdAsync(int id, int userId);

        Task<bool> UpdateTaskAsync(int id, UpdateTaskDto dto, int userId);

        Task<bool> DeleteTaskAsync(int id, int userId);
    }
}