using Microsoft.EntityFrameworkCore;
using TodoApi.Data;
using TodoApi.DTOs.Tasks;
using TodoApi.Models;
using TodoApi.Services;
using Xunit;

namespace TodoApi.Tests;

public class TaskServiceTests
{
    private static AppDbContext CreateContext()
    {
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;

        return new AppDbContext(options);
    }

    [Fact]
    public async Task CreateTaskAsync_SavesTask_AndTrimsFields()
    {
        await using var context = CreateContext();
        var service = new TaskService(context);

        var dto = new CreateTaskDto
        {
            Title = "  Buy milk  ",
            Description = "  2 liters  ",
            DueDate = null
        };

        var result = await service.CreateTaskAsync(dto, userId: 1);

        Assert.Equal("Buy milk", result.Title);
        Assert.Equal("2 liters", result.Description);
        Assert.False(result.IsCompleted);
        Assert.Single(context.Tasks);
    }

    [Fact]
    public async Task GetAllTasksAsync_OnlyReturnsTasksForGivenUser()
    {
        await using var context = CreateContext();
        context.Tasks.AddRange(
            new TodoTask { Title = "A", Description = "A", UserId = 1 },
            new TodoTask { Title = "B", Description = "B", UserId = 2 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetAllTasksAsync(userId: 1, pageNumber: 1, pageSize: 20);

        Assert.Single(result.Items);
        Assert.Equal("A", result.Items.First().Title);
        Assert.Equal(1, result.TotalCount);
        Assert.Equal(1, result.TotalPages);
    }

    [Fact]
    public async Task GetAllTasksAsync_ReturnsCorrectPageAndMetadata()
    {
        await using var context = CreateContext();
        for (var i = 1; i <= 5; i++)
        {
            context.Tasks.Add(new TodoTask
            {
                Title = $"Task {i}",
                Description = "x",
                UserId = 1,
                CreatedAt = DateTime.UtcNow.AddMinutes(i)
            });
        }

        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetAllTasksAsync(userId: 1, pageNumber: 2, pageSize: 2);

        Assert.Equal(2, result.Items.Count);
        Assert.Equal(2, result.PageNumber);
        Assert.Equal(2, result.PageSize);
        Assert.Equal(5, result.TotalCount);
        Assert.Equal(3, result.TotalPages);
        Assert.True(result.HasNextPage);
        Assert.True(result.HasPreviousPage);
    }

    [Fact]
    public async Task GetTaskByIdAsync_ReturnsNull_WhenTaskBelongsToAnotherUser()
    {
        await using var context = CreateContext();
        context.Tasks.Add(new TodoTask { Id = 1, Title = "Secret", Description = "x", UserId = 2 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var result = await service.GetTaskByIdAsync(id: 1, userId: 1);

        Assert.Null(result);
    }

    [Fact]
    public async Task UpdateTaskAsync_ReturnsFalse_WhenTaskNotFoundForUser()
    {
        await using var context = CreateContext();
        context.Tasks.Add(new TodoTask { Id = 1, Title = "Task", Description = "x", UserId = 2 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var dto = new UpdateTaskDto { Title = "New", Description = "New", IsCompleted = true };

        var updated = await service.UpdateTaskAsync(id: 1, dto, userId: 1);

        Assert.False(updated);
    }

    [Fact]
    public async Task UpdateTaskAsync_UpdatesFields_WhenOwnedByUser()
    {
        await using var context = CreateContext();
        context.Tasks.Add(new TodoTask { Id = 1, Title = "Old", Description = "Old", UserId = 1 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var dto = new UpdateTaskDto { Title = "  New Title  ", Description = "  New Desc  ", IsCompleted = true };

        var updated = await service.UpdateTaskAsync(id: 1, dto, userId: 1);
        var task = await context.Tasks.FindAsync(1);

        Assert.True(updated);
        Assert.Equal("New Title", task!.Title);
        Assert.Equal("New Desc", task.Description);
        Assert.True(task.IsCompleted);
    }

    [Fact]
    public async Task DeleteTaskAsync_ReturnsFalse_WhenTaskBelongsToAnotherUser()
    {
        await using var context = CreateContext();
        context.Tasks.Add(new TodoTask { Id = 1, Title = "Task", Description = "x", UserId = 2 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var deleted = await service.DeleteTaskAsync(id: 1, userId: 1);

        Assert.False(deleted);
        Assert.Single(context.Tasks);
    }

    [Fact]
    public async Task DeleteTaskAsync_RemovesTask_WhenOwnedByUser()
    {
        await using var context = CreateContext();
        context.Tasks.Add(new TodoTask { Id = 1, Title = "Task", Description = "x", UserId = 1 });
        await context.SaveChangesAsync();

        var service = new TaskService(context);
        var deleted = await service.DeleteTaskAsync(id: 1, userId: 1);

        Assert.True(deleted);
        Assert.Empty(context.Tasks);
    }
}