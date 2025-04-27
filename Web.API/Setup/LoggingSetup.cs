using Serilog.Extensions.Logging;
using Serilog;

namespace Web.API.Setup
{
    public static class LoggingSetup
    {
        public static WebApplicationBuilder ConfigureLogger(this WebApplicationBuilder builder)
        {
            // Disable the default ASP.NET Core console logging
            builder.Logging.ClearProviders();

            // Configure Serilog
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .CreateLogger();

            // Add Serilog to the application
            builder.Host.UseSerilog();

            // Add the Serilog logger provider
            builder.Logging.AddProvider(new SerilogLoggerProvider());

            return builder;
        }
    }
}