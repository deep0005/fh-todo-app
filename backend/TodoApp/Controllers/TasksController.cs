using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Models.DTOs.Tasks;
using TodoApp.Api.Models.Enums;
using TodoApp.Api.Services.Interfaces;
using TaskStatus = TodoApp.Api.Models.Enums.TaskStatus;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TasksController(ITaskService taskService) : ControllerBase
{
    private int UserId => int.Parse(
        User.FindFirstValue(ClaimTypes.NameIdentifier)!);

    [HttpGet]
    public async Task<IActionResult> GetAll(
        [FromQuery] TaskStatus? status,
        [FromQuery] TaskPriority? priority,
        [FromQuery] string? sortBy)
    {
        var tasks = await taskService.GetAllAsync(UserId, status, priority, sortBy);
        return Ok(tasks);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var task = await taskService.GetByIdAsync(id, UserId);
        return Ok(task);
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTaskDto dto)
    {
        var task = await taskService.CreateAsync(dto, UserId);
        return CreatedAtAction(nameof(GetById), new { id = task.Id }, task);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(int id, UpdateTaskDto dto)
    {
        var task = await taskService.UpdateAsync(id, dto, UserId);
        return Ok(task);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        await taskService.DeleteAsync(id, UserId);
        return NoContent();
    }
}