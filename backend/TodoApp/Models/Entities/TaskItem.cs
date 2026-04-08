using System.ComponentModel.DataAnnotations;
using TodoApp.Api.Models.Enums;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;


namespace TodoApp.Api.Models.Entities;

public class TaskItem
{
    public int Id { get; set; }
    
    [MaxLength(200)]
    public string Title { get; set; } = string.Empty;
    
    [MaxLength(1000)]
    public string? Description { get; set; }
    
    public TaskStatus Status { get; set; } = TaskStatus.Pending;
    public TaskPriority Priority { get; set; } = TaskPriority.Medium;
    public DateTime? DueDate { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
    
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}