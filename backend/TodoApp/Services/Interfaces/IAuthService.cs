using TodoApp.Api.Models.DTOs.Auth;

namespace TodoApp.Api.Services.Interfaces;

public interface IAuthService
{
    Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request);
    Task<AuthResponseDto> LoginAsync(LoginRequestDto request);
    Task<bool> IsUsernameAvailableAsync(string username);

}