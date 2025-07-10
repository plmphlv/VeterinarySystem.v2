using Application;
using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure;
using Infrastructure.Persistence;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using NSwag;
using NSwag.Generation.Processors.Security;
using Serilog;
using System.Text.Json.Serialization;
using Web.API.Extensions;
using Web.API.Filters;
using Web.API.Services;
using Web.API.Setup;

namespace Web.API;

public class Program
{
    public static async Task Main(string[] args)
    {
        WebApplicationBuilder builder = WebApplication.CreateBuilder(args).ConfigureLogger();

        builder.Services.AddControllers(c => c.Filters.Add(new ApiExceptionFilterAttribute()))
            .AddJsonOptions(options =>
            {
                options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
                options.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
            });

        builder.Services.AddScoped<ICurrentUserService, CurrentUserService>();

        builder.Services
            .AddApplication()
            .AddInfrastructure(builder.Configuration)
            .AddHttpContextAccessor()
            .AddCors(builder.Environment)
            .AddOpenApiDocument(configure =>
            {
                configure.Title = "VeterinarySystem Web.API";
                configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Scheme = JwtBearerDefaults.AuthenticationScheme,
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    In = OpenApiSecurityApiKeyLocation.Header,
                    BearerFormat = "JWT",
                    Name = "Authorization",
                    Description = "Type into the textbox: Bearer {your JWT token}."
                });

                configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
            });

        builder.Services.AddHealthChecks();

        if (builder.Environment.IsDevelopment())
        {
            builder.WebHost.UseUrls("https://localhost:44348");
        }

        WebApplication app = builder.Build();

        app.UseCors();

        app.UseSerilogRequestLogging();

        if (app.Environment.IsDevelopment())
        {
            app.UseOpenApi();
            app.UseSwaggerUi();
        }

        try
        {
            using IServiceScope scope = app.Services.CreateScope();

            IApplicationDbContext context = scope.ServiceProvider.GetRequiredService<IApplicationDbContext>();

            UserManager<User> userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>();
            RoleManager<IdentityRole> roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();

            await context.Database.MigrateAsync();

            await ApplicationDbContextSeed.SeedRoles(roleManager);

            if (app.Environment.IsDevelopment())
            {
                await ApplicationDbContextSeed.SeedDevelopmentData((ApplicationDbContext)context, userManager, builder.Configuration);
            }
        }
        catch (Exception ex)
        {
            Log.Fatal("An error occurred while migrating or seeding the database.", ex);

            throw;
        }

        app.UseAuthentication();
        app.UseAuthorization();

        app.MapControllers();
        app.UseHealthChecks("/health");

        try
        {
            await app.RunAsync();
        }
        catch (Exception ex)
        {
            Log.Fatal(ex, "Host terminated unexpectedly");

            throw;
        }
    }
}
