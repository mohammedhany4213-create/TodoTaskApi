using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TodoApi.DTOs.Tasks;
using TodoApi.Services.Interfaces;

namespace TodoApi.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly ITaskService _taskService;

    public TasksController(ITaskService taskService)
    {
        _taskService = taskService;
    }

    [HttpGet]
    public async Task<ActionResult<PagedResultDto<TaskDto>>> GetAllTasks(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 20)
    {
        if (pageNumber < 1)
            return BadRequest(new { message = "pageNumber must be greater than 0." });

        if (pageSize < 1 || pageSize > 100)
            return BadRequest(new { message = "pageSize must be between 1 and 100." });

        var userId = GetCurrentUserId();
        return Ok(await _taskService.GetAllTasksAsync(userId, pageNumber, pageSize));
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TaskDto>> GetTaskById(int id)
    {
        var userId = GetCurrentUserId();
        var task = await _taskService.GetTaskByIdAsync(id, userId);

        return task is null ? NotFound() : Ok(task);
    }

    [HttpPost]
    public async Task<ActionResult<TaskDto>> CreateTask(CreateTaskDto dto)
    {
        var userId = GetCurrentUserId();
        var task = await _taskService.CreateTaskAsync(dto, userId);

        return CreatedAtAction(nameof(GetTaskById), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> UpdateTask(int id, UpdateTaskDto dto)
    {
        var userId = GetCurrentUserId();
        var updated = await _taskService.UpdateTaskAsync(id, dto, userId);

        return updated ? NoContent() : NotFound();
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteTask(int id)
    {
        var userId = GetCurrentUserId();
        var deleted = await _taskService.DeleteTaskAsync(id, userId);

        return deleted ? NoContent() : NotFound();
    }

    private int GetCurrentUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);

        if (!int.TryParse(value, out var userId) || userId <= 0)
            throw new UnauthorizedAccessException("Invalid user identity.");

        return userId;
    }
}
