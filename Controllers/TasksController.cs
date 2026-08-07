using Microsoft.AspNetCore.Mvc ;
using TodoApi.Services;
using TodoApi.Services.Interfaces ;
using Microsoft.AspNetCore.Authorization;
using TodoApi.DTOs ;
using System.Security.Claims ;
using System.IdentityModel.Tokens.Jwt;
using TodoApi.DTOs.Tasks;

namespace TodoApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    
    public class TodoController : ControllerBase
    {
        private readonly ITaskService _taskService ;

        public TodoController(ITaskService taskService)
        {
            _taskService = taskService ;
        }

    private int GetCurrentUserId()
{
    var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

    if (string.IsNullOrEmpty(userId))
        throw new UnauthorizedAccessException("User ID not found.");

    return int.Parse(userId);
}
    [HttpGet]
    public async Task<IActionResult> GetAllTasks()
        {
            var userId = GetCurrentUserId();
            var tasks = await _taskService.GetAllTasksAsync(userId);
            return Ok(tasks);
        }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskDto dto)
        {
            var userId = GetCurrentUserId() ;
            var task = await _taskService.CreateTaskAsync(dto ,userId);
            return CreatedAtAction(
                nameof(GetTaskById),
                new {id = task.Id} ,
                task
            );
        }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetTaskById(int id)
        {
            var userId = GetCurrentUserId() ;
            var task = await _taskService.GetTaskByIdAsync(id , userId);
            if(task == null)
            return NotFound() ;

            return Ok(task) ;
        }
    
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateTask(int id , UpdateTaskDto dto)
        {
            var userId = GetCurrentUserId() ;
            var updated = await _taskService.UpdateTaskAsync(id , dto , userId) ;
            if(!updated)
            return NotFound();

            return NoContent();
        }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(int id)
        {
            var userId = GetCurrentUserId() ;
            var deleted =await _taskService.DeleteTaskAsync(id , userId);
            if(!deleted)
                return NotFound();
            return NoContent();
        }


    }
}

