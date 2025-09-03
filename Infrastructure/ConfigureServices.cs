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

        services.AddTokenBasedAuthentication();

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
        services.Configure<JwtSettings>(configuration.GetSection("Authentication:Jwt"));
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
        services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString("DbConnection"),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

        services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
    }

    private static void AddTokenBasedAuthentication(this IServiceCollection services)
    {
        string? key = Environment.GetEnvironmentVariable("JWT_SECURITY_KEY");

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
                  ValidIssuer = Environment.GetEnvironmentVariable("JWT_ISSUER"),

                  ValidateAudience = true,
                  ValidAudience = Environment.GetEnvironmentVariable("JWT_AUDIENCE"),

                  ValidateIssuerSigningKey = true,
                  IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key)),

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
