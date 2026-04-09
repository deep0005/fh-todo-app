using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Moq;
using TodoApp.Api.Models.DTOs.Auth;
using TodoApp.Api.Services;
using TodoApp.Api.Tests.Helpers;
using Xunit;

namespace TodoApp.Api.Tests.Services;

public class AuthServiceTests
{
    private readonly Mock<IConfiguration> _configMock;
    private readonly Mock<ILogger<AuthService>> _loggerMock;

    public AuthServiceTests()
    {
        _configMock = new Mock<IConfiguration>();
        _loggerMock = new Mock<ILogger<AuthService>>();

        _configMock.Setup(c => c["Jwt:Key"]).Returns("SuperSecretKeyThatIsAtLeast32CharsLong!");
        _configMock.Setup(c => c["Jwt:Issuer"]).Returns("TodoApp");
        _configMock.Setup(c => c["Jwt:Audience"]).Returns("TodoApp");
        _configMock.Setup(c => c["Jwt:ExpiryHours"]).Returns("24");
    }

    private AuthService CreateService()
    {
        var context = TestDbContextFactory.Create();
        return new AuthService(context, _configMock.Object, _loggerMock.Object);
    }

    [Fact]
    public async Task Register_Success_ReturnsToken()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequestDto
        {
            Username = "testuser",
            Password = "password123"
        };

        // Act
        var result = await service.RegisterAsync(request);

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal("testuser", result.Username);
    }

    [Fact]
    public async Task Register_DuplicateUsername_ThrowsException()
    {
        // Arrange
        var service = CreateService();
        var request = new RegisterRequestDto
        {
            Username = "testuser",
            Password = "password123"
        };

        await service.RegisterAsync(request);

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => service.RegisterAsync(request));
    }

    [Fact]
    public async Task Login_Success_ReturnsToken()
    {
        // Arrange
        var service = CreateService();
        await service.RegisterAsync(new RegisterRequestDto
        {
            Username = "testuser",
            Password = "password123"
        });

        // Act
        var result = await service.LoginAsync(new LoginRequestDto
        {
            Username = "testuser",
            Password = "password123"
        });

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Token);
        Assert.Equal("testuser", result.Username);
    }

    [Fact]
    public async Task Login_WrongPassword_ThrowsException()
    {
        // Arrange
        var service = CreateService();
        await service.RegisterAsync(new RegisterRequestDto
        {
            Username = "testuser",
            Password = "password123"
        });

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.LoginAsync(new LoginRequestDto
            {
                Username = "testuser",
                Password = "wrongpassword"
            }));
    }

    [Fact]
    public async Task Login_UserNotFound_ThrowsException()
    {
        // Arrange
        var service = CreateService();

        // Act & Assert
        await Assert.ThrowsAsync<UnauthorizedAccessException>(
            () => service.LoginAsync(new LoginRequestDto
            {
                Username = "nobody",
                Password = "password123"
            }));
    }

    [Fact]
    public async Task IsUsernameAvailable_Available_ReturnsTrue()
    {
        // Arrange
        var service = CreateService();

        // Act
        var result = await service.IsUsernameAvailableAsync("newuser");

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task IsUsernameAvailable_Taken_ReturnsFalse()
    {
        // Arrange
        var service = CreateService();
        await service.RegisterAsync(new RegisterRequestDto
        {
            Username = "testuser",
            Password = "password123"
        });

        // Act
        var result = await service.IsUsernameAvailableAsync("testuser");

        // Assert
        Assert.False(result);
    }
}