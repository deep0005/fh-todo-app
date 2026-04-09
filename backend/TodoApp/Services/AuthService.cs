using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using TodoApp.Api.Data;
using TodoApp.Api.Models.DTOs.Auth;
using TodoApp.Api.Models.Entities;
using TodoApp.Api.Services.Interfaces;

namespace TodoApp.Api.Services;

public class AuthService(
    AppDbContext context,
    IConfiguration configuration,
    ILogger<AuthService> logger) : IAuthService
{
    public async Task<AuthResponseDto> RegisterAsync(RegisterRequestDto request)
    {
        logger.LogInformation("Register attempt for username: {Username}", request.Username);

        if (await context.Users.AnyAsync(u => u.Username == request.Username))
        {
            logger.LogWarning("Registration failed — username already exists: {Username}", request.Username);
            throw new InvalidOperationException("Username already exists.");
        }

        var user = new User
        {
            Username = request.Username,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            CreatedAt = DateTime.UtcNow
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        logger.LogInformation("User registered successfully: {Username}", request.Username);
        return GenerateToken(user);
    }

    public async Task<AuthResponseDto> LoginAsync(LoginRequestDto request)
    {
        logger.LogInformation("Login attempt for username: {Username}", request.Username);

        var user = await context.Users
            .FirstOrDefaultAsync(u => u.Username == request.Username);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            logger.LogWarning("Login failed — invalid credentials for username: {Username}", request.Username);
            throw new UnauthorizedAccessException("Invalid username or password.");
        }

        logger.LogInformation("Login successful for username: {Username}", request.Username);
        return GenerateToken(user);
    }

    private AuthResponseDto GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expiry = DateTime.UtcNow.AddHours(
            double.Parse(configuration["Jwt:ExpiryHours"]!));

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: configuration["Jwt:Issuer"],
            audience: configuration["Jwt:Audience"],
            claims: claims,
            expires: expiry,
            signingCredentials: credentials
        );

        return new AuthResponseDto
        {
            Token = new JwtSecurityTokenHandler().WriteToken(token),
            Username = user.Username,
            ExpiresAt = expiry
        };
    }

    public async Task<bool> IsUsernameAvailableAsync(string username)
    {
        logger.LogInformation("Username availability check for: {Username}", username);
        return !await context.Users.AnyAsync(u => u.Username == username);
    }
}