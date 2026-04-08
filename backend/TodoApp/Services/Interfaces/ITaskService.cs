using TodoApp.Api.Models.DTOs.Tasks;
using TodoApp.Api.Models.Enums;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;

namespace TodoApp.Api.Services.Interfaces;

public interface ITaskService
{
    Task<IEnumerable<TaskResponseDto>> GetAllAsync(
        int userId, 
        TaskStatus? status, 
        TaskPriority? priority,
        string? sortBy);
    Task<TaskResponseDto> GetByIdAsync(int id, int userId);
    Task<TaskResponseDto> CreateAsync(CreateTaskDto dto, int userId);
    Task<TaskResponseDto> UpdateAsync(int id, UpdateTaskDto dto, int userId);
    Task DeleteAsync(int id, int userId);
}