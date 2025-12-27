using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Identity;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace Infrastructure;

public static class ConfigureServices
{

    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddJwtSettings(configuration);

        services.AddDbContexts(configuration);

        services.AddTransient<IJwtManager, JwtManager>();

        services.AddIdentityCore<User>(options =>
        {
            options.SignIn.RequireConfirmedAccount = true;
            options.User.RequireUniqueEmail = true;
            options.Password.RequireDigit = true;
            options.Password.RequireLowercase = false;
            options.Password.RequireUppercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequiredLength = 8;
        })
            .AddRoles<IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.AddTokenBasedAuthentication(configuration);

        services.Configure<EmailSettings>(configuration.GetSection("EmailSettings"));

        services.AddSingleton<IEmailService, EmailService>();
        services.AddTransient<IDateTime, DateTimeService>();
        services.AddTransient<ILocalizationServices, LocalizationServices>();
        services.AddScoped<IIdentityService, IdentityService>();

        services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();

        services.AddUrlService();

        return services;
    }

    private static void AddJwtSettings(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddOptions<JwtSettings>()
            .Bind(configuration.GetSection("Authentication:JwtSettings"))
            .ValidateDataAnnotations();
    }

    private static void AddUrlService(this IServiceCollection services)
    {
        services.AddScoped(x =>
        {
            ActionContext actionContext = x.GetRequiredService<IActionContextAccessor>()
                .ActionContext!;
            IUrlHelperFactory factory = x.GetRequiredService<IUrlHelperFactory>()!;
            return factory.GetUrlHelper(actionContext);
        });
    }

    private static void AddDbContexts(this IServiceCollection services, IConfiguration configuration)
    {
        string? connectionString = string.Empty;

        /*
         Different connection string for Windows and MacOS
         will allow developers on different OS to work without constantrly changing the connection string.
         Will be removed in production
         */
        if (OperatingSystem.IsWindows())
        {
            connectionString = configuration.GetConnectionString("DbConnection");
        }
        else if (OperatingSystem.IsMacOS())
        {
            connectionString = configuration.GetConnectionString("MacDbConnection");
        }

        services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        connectionString,
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
    }

    private static void AddTokenBasedAuthentication(this IServiceCollection services, IConfiguration configuration)
    {
        JwtSettings settings = configuration.GetSection("Authentication:JwtSettings").Get<JwtSettings>()!;

        services.AddAuthentication(options =>
        {
            options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        })
          .AddJwtBearer(options =>
          {
              options.TokenValidationParameters = new TokenValidationParameters
              {
                  ValidateIssuer = true,
                  ValidIssuer = settings.JwtIssuer,

                  ValidateAudience = true,
                  ValidAudience = settings.JwtAudience,

                  ValidateIssuerSigningKey = true,
                  IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.JwtSecurityKey)),

                  ValidateLifetime = true,
                  RequireExpirationTime = true,
                  RequireSignedTokens = true,

                  ClockSkew = TimeSpan.Zero
              };

              options.Events = new JwtBearerEvents
              {
                  OnAuthenticationFailed = context =>
                  {
                      if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                      {
                          context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                          context.Response.ContentType = "application/json";

                          return context.Response.WriteAsync("{\"error\":\"invalid_token\",\"error_description\":\"The access token expired\"}");
                      }

                      return Task.CompletedTask;
                  }
              };
          });
    }
}
