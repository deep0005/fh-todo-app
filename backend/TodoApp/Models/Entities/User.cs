using System.ComponentModel.DataAnnotations;

namespace TodoApp.Api.Models.Entities;

public class User
{
    public int Id { get; set; }
    
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
    
    [MaxLength(255)]
    public string PasswordHash { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}