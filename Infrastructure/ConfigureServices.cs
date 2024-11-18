using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Persistence;
using Infrastructure.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.Routing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Infrastructure;

public static class ConfigureServices
{

	public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddDbContext<ApplicationDbContext>(options =>
			options.UseSqlServer(
				configuration.GetConnectionString("DbConnection"),
				b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));


		services.AddIdentityCore<User>(options =>
		{
			options.SignIn.RequireConfirmedAccount = true;
			options.Password.RequireDigit = true;
			options.Password.RequireLowercase = false;
			options.Password.RequireUppercase = false;
			options.Password.RequireNonAlphanumeric = false;
			options.Password.RequiredLength = 8;
		})
			.AddRoles<IdentityRole>()
			.AddEntityFrameworkStores<ApplicationDbContext>()
			.AddDefaultTokenProviders();

		services.AddScoped<IApplicationDbContext>(provider => provider.GetRequiredService<ApplicationDbContext>());
		services.AddTransient<IDateTime, DateTimeService>();
		services.AddTransient<ILocalizationServices, LocalizationServices>();
		services.AddScoped<IIdentityService, IdentityService>();

		services.AddSingleton<IActionContextAccessor, ActionContextAccessor>();
		services.AddScoped(x =>
		{
			ActionContext actionContext = x.GetRequiredService<IActionContextAccessor>()
				.ActionContext!;
			IUrlHelperFactory factory = x.GetRequiredService<IUrlHelperFactory>()!;
			return factory.GetUrlHelper(actionContext);
		});

		return services;
	}
}
