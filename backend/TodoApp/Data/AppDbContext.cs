using Microsoft.EntityFrameworkCore;
using TodoApp.Api.Models.Entities;

namespace TodoApp.Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<TaskItem> Tasks => Set<TaskItem>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Unique username
        modelBuilder.Entity<User>()
            .HasIndex(u => u.Username)
            .IsUnique();

        // User has many tasks
        modelBuilder.Entity<TaskItem>()
            .HasOne(t => t.User)
            .WithMany(u => u.Tasks)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // Soft delete filter — auto exclude deleted tasks
        modelBuilder.Entity<TaskItem>()
            .HasQueryFilter(t => !t.IsDeleted);
    }
}