using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Persistence;

namespace Infrastructure;

public static class ConfigureServices
{

	public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
	{
		services.AddDbContext<ApplicationDbContext>(options =>
			options.UseSqlServer(
				configuration.GetConnectionString("DbConnection"),
				b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));

		return services;
	}
}
