using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Data;
using TodoApp.Api.Helpers;
using TodoApp.Api.Models.DTOs.Tasks;
using TodoApp.Api.Models.Entities;
using TodoApp.Api.Models.Enums;
using TodoApp.Api.Services.Interfaces;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;

namespace TodoApp.Api.Services;

public class TaskService(
    AppDbContext context,
    ILogger<TaskService> logger) : ITaskService
{
    public async Task<IEnumerable<TaskResponseDto>> GetAllAsync(
        int userId,
        TaskStatus? status,
        TaskPriority? priority,
        string? sortBy)
    {
        logger.LogInformation(
            "Fetching tasks for userId: {UserId}, status: {Status}, priority: {Priority}, sortBy: {SortBy}",
            userId, status, priority, sortBy);

        var query = context.Tasks
            .Where(t => t.UserId == userId);

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (priority.HasValue)
            query = query.Where(t => t.Priority == priority.Value);

        query = sortBy?.ToLower() switch
        {
            "duedate_asc" => query.OrderBy(t => t.DueDate),
            "duedate_desc" => query.OrderByDescending(t => t.DueDate),
            "priority_asc" => query.OrderBy(t => t.Priority),
            "priority_desc" => query.OrderByDescending(t => t.Priority),
            _ => query.OrderByDescending(t => t.CreatedAt)
        };

        var tasks = await query
            .Select(t => MapToDto(t))
            .ToListAsync();

        logger.LogInformation("Returned {Count} tasks for userId: {UserId}", tasks.Count(), userId);

        return tasks;
    }

    public async Task<TaskResponseDto> GetByIdAsync(int id, int userId)
    {
        logger.LogInformation("Fetching task {TaskId} for userId: {UserId}", id, userId);

        var task = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new NotFoundException($"Task with id {id} not found.");

        return MapToDto(task);
    }

    public async Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int userId)
    {
        logger.LogInformation("Creating task for userId: {UserId}, title: {Title}", userId, dto.Title);

        var task = new TaskItem
        {
            Title = dto.Title,
            Description = dto.Description,
            Priority = dto.Priority,
            DueDate = dto.DueDate,
            Status = TaskStatus.Pending,
            UserId = userId,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Tasks.Add(task);
        await context.SaveChangesAsync();

        logger.LogInformation("Task created successfully with id: {TaskId} for userId: {UserId}", task.Id, userId);

        return MapToDto(task);
    }

    public async Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto, int userId)
    {
        logger.LogInformation("Updating task {TaskId} for userId: {UserId}", id, userId);

        var task = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new NotFoundException($"Task with id {id} not found.");

        task.Title = dto.Title;
        task.Description = dto.Description;
        task.Status = dto.Status;
        task.Priority = dto.Priority;
        task.DueDate = dto.DueDate;
        task.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Task {TaskId} updated successfully for userId: {UserId}", id, userId);

        return MapToDto(task);
    }

    public async Task DeleteAsync(int id, int userId)
    {
        logger.LogInformation("Deleting task {TaskId} for userId: {UserId}", id, userId);

        var task = await context.Tasks
            .FirstOrDefaultAsync(t => t.Id == id && t.UserId == userId)
            ?? throw new NotFoundException($"Task with id {id} not found.");

        task.IsDeleted = true;
        task.UpdatedAt = DateTime.UtcNow;

        await context.SaveChangesAsync();

        logger.LogInformation("Task {TaskId} soft deleted successfully for userId: {UserId}", id, userId);
    }

    private static TaskResponseDto MapToDto(TaskItem task) => new()
    {
        Id = task.Id,
        Title = task.Title,
        Description = task.Description,
        Status = task.Status,
        Priority = task.Priority,
        DueDate = task.DueDate,
        CreatedAt = task.CreatedAt,
        UpdatedAt = task.UpdatedAt
    };
}