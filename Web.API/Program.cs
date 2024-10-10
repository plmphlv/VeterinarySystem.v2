using Microsoft.EntityFrameworkCore;
using Persistence;
using Serilog;
using Serilog.Exceptions;
using System.Reflection;

namespace Web.API;

public class Program
{
	public static async Task Main(string[] args)
	{
		WebApplicationBuilder builder = WebApplication.CreateBuilder(args);

		string environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT")!;

		var configuration = new ConfigurationBuilder()
			.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
			.AddJsonFile(
				$"appsettings.{environment}.json",
				optional: true)
			.Build();

		Log.Logger = new LoggerConfiguration()
			.Enrich.FromLogContext()
			.Enrich.WithExceptionDetails()
			.WriteTo.Debug()
			.WriteTo.Console()
			.ReadFrom.Configuration(configuration)
			.CreateLogger();

		var host = CreateHostBuilder(args).Build();

		using (var scope = host.Services.CreateScope())
		{
			var services = scope.ServiceProvider;

			try
			{
				ApplicationDbContext context = services.GetRequiredService<ApplicationDbContext>();
				//context.Database.Migrate();
			}
			catch (Exception ex)
			{
				Log.Fatal($"An error occurred while migrating or seeding the database.", ex);
				throw;
			}

		}

		try
		{
			await host.RunAsync();
		}
		catch (Exception ex)
		{
			Log.Fatal($"Failed to start {Assembly.GetExecutingAssembly().GetName().Name}", ex);
			throw;
		}
	}

	public static IHostBuilder CreateHostBuilder(string[] args)
	{
		return Host.CreateDefaultBuilder(args)
			.ConfigureWebHostDefaults(webBuilder =>
				webBuilder.UseStartup<Startup>())
			.UseSerilog();
	}
}
