using System.ComponentModel.DataAnnotations;
using TodoApp.Api.Models.Enums;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;

namespace TodoApp.Api.Models.DTOs.Tasks;

public class UpdateTaskDto
{
    [Required(ErrorMessage = "Title is required.")]
    [MaxLength(200, ErrorMessage = "Title cannot exceed 200 characters.")]
    public string Title { get; set; } = string.Empty;

    [MaxLength(1000, ErrorMessage = "Description cannot exceed 1000 characters.")]
    public string? Description { get; set; }

    public TaskStatus Status { get; set; }
    public TaskPriority Priority { get; set; }
    public DateTime? DueDate { get; set; }
}