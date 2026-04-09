using Microsoft.Extensions.Logging;
using Moq;
using TodoApp.Api.Helpers;
using TodoApp.Api.Models.DTOs.Tasks;
using TodoApp.Api.Models.Enums;
using TodoApp.Api.Services;
using TodoApp.Api.Tests.Helpers;
using Xunit;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;

namespace TodoApp.Api.Tests.Services;

public class TaskServiceTests
{
    private readonly Mock<ILogger<TaskService>> _loggerMock;

    public TaskServiceTests()
    {
        _loggerMock = new Mock<ILogger<TaskService>>();
    }

    private TaskService CreateService()
    {
        var context = TestDbContextFactory.Create();
        return new TaskService(context, _loggerMock.Object);
    }

    [Fact]
    public async Task GetAll_ReturnsOnlyUserTasks()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        await service.CreateAsync(new CreateTaskDto
        {
            Title = "User 1 Task",
            Priority = TaskPriority.Medium
        }, userId: 1);

        await service.CreateAsync(new CreateTaskDto
        {
            Title = "User 2 Task",
            Priority = TaskPriority.Medium
        }, userId: 2);

        // Act
        var result = await service.GetAllAsync(1, null, null, null);

        // Assert
        Assert.Single(result);
        Assert.Equal("User 1 Task", result.First().Title);
    }

    [Fact]
    public async Task GetById_ReturnsTask()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Test Task",
            Priority = TaskPriority.High
        }, userId: 1);

        // Act
        var result = await service.GetByIdAsync(created.Id, userId: 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("Test Task", result.Title);
        Assert.Equal(TaskPriority.High, result.Priority);
    }

    [Fact]
    public async Task GetById_WrongUser_ThrowsNotFoundException()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Test Task",
            Priority = TaskPriority.Medium
        }, userId: 1);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => service.GetByIdAsync(created.Id, userId: 2));
    }

    [Fact]
    public async Task Create_SetsDefaultsProperly()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.CreateAsync(new CreateTaskDto
        {
            Title = "New Task",
            Priority = TaskPriority.Low
        }, userId: 1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("New Task", result.Title);
        Assert.Equal(TaskStatus.Pending, result.Status);
        Assert.Equal(TaskPriority.Low, result.Priority);
    }

    [Fact]
    public async Task Update_UpdatesTaskFields()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Original Title",
            Priority = TaskPriority.Low
        }, userId: 1);

        // Act
        var result = await service.UpdateAsync(created.Id, new UpdateTaskDto
        {
            Title = "Updated Title",
            Status = TaskStatus.InProgress,
            Priority = TaskPriority.High
        }, userId: 1);

        // Assert
        Assert.Equal("Updated Title", result.Title);
        Assert.Equal(TaskStatus.InProgress, result.Status);
        Assert.Equal(TaskPriority.High, result.Priority);
    }

    [Fact]
    public async Task Update_WrongUser_ThrowsNotFoundException()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Test Task",
            Priority = TaskPriority.Medium
        }, userId: 1);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => service.UpdateAsync(created.Id, new UpdateTaskDto
            {
                Title = "Hacked Title",
                Status = TaskStatus.Completed,
                Priority = TaskPriority.High
            }, userId: 2));
    }

    [Fact]
    public async Task Delete_SoftDeletesTask()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Task to Delete",
            Priority = TaskPriority.Medium
        }, userId: 1);

        // Act
        await service.DeleteAsync(created.Id, userId: 1);

        // Assert — task should no longer appear in list
        var tasks = await service.GetAllAsync(1, null, null, null);
        Assert.Empty(tasks);
    }

    [Fact]
    public async Task Delete_WrongUser_ThrowsNotFoundException()
    {
        // Arrange
        var context = TestDbContextFactory.Create();
        var service = new TaskService(context, _loggerMock.Object);

        var created = await service.CreateAsync(new CreateTaskDto
        {
            Title = "Test Task",
            Priority = TaskPriority.Medium
        }, userId: 1);

        // Act & Assert
        await Assert.ThrowsAsync<NotFoundException>(
            () => service.DeleteAsync(created.Id, userId: 2));
    }
}