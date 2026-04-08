using Microsoft.AspNetCore.Mvc;
using TodoApp.Api.Models.DTOs.Auth;
using TodoApp.Api.Services.Interfaces;

namespace TodoApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequestDto request)
    {
        var result = await authService.RegisterAsync(request);
        return Ok(result);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequestDto request)
    {
        var result = await authService.LoginAsync(request);
        return Ok(result);
    }
    
    [HttpGet("check-username/{username}")]
    public async Task<IActionResult> CheckUsername(string username)
    {
        var available = await authService.IsUsernameAvailableAsync(username);
        return Ok(new UsernameCheckResponseDto { Available = available });
    }
}