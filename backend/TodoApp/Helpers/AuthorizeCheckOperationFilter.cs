using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace TodoApp.Api.Helpers;

public class AuthorizeCheckOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAuthorize = context.MethodInfo.DeclaringType?
                               .GetCustomAttributes(true)
                               .OfType<AuthorizeAttribute>()
                               .Any() == true ||
                           context.MethodInfo
                               .GetCustomAttributes(true)
                               .OfType<AuthorizeAttribute>()
                               .Any();

        if (!hasAuthorize) return;

        operation.Security = new List<OpenApiSecurityRequirement>
        {
            new()
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new List<string>()
                }
            }
        };
    }
}