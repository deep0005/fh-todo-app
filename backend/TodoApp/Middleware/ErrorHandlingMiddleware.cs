using System.Net;
using System.Text.Json;
using TodoApp.Api.Helpers;

namespace TodoApp.Api.Middleware;

public class ErrorHandlingMiddleware(
    RequestDelegate next,
    ILogger<ErrorHandlingMiddleware> logger)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(
        HttpContext context, Exception exception)
    {
        var (statusCode, message) = exception switch
        {
            InvalidOperationException => 
                (HttpStatusCode.BadRequest, exception.Message),
            UnauthorizedAccessException => 
                (HttpStatusCode.Unauthorized, exception.Message),
            KeyNotFoundException => 
                (HttpStatusCode.NotFound, exception.Message),
            _ => (HttpStatusCode.InternalServerError, 
                "An unexpected error occurred.")
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var response = new
        {
            statusCode = (int)statusCode,
            message,
            timestamp = DateTime.UtcNow
        };

        await context.Response.WriteAsync(
            JsonSerializer.Serialize(response));
    }
}