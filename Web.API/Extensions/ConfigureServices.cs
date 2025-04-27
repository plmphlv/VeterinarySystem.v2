namespace Web.API.Extensions
{
    public static class ConfigureServices
    {
        public static IServiceCollection AddCors(this IServiceCollection serviceCollection, IWebHostEnvironment environment)
        {
            string[] corsOrigins = Environment.GetEnvironmentVariable("CORS_ORIGINS")
                ?.Split(';', StringSplitOptions.RemoveEmptyEntries) ?? [];

            if (environment.IsDevelopment())
            {
                serviceCollection.AddCors(options =>
                {
                    options.AddDefaultPolicy(builder =>
                    {
                        builder.AllowAnyOrigin()
                            .AllowAnyHeader()
                            .AllowAnyMethod();
                    });
                });
            }
            else
            {
                serviceCollection.AddCors(options =>
                {
                    options.AddDefaultPolicy(builder =>
                    {
                        builder.WithOrigins(corsOrigins)
                            .AllowAnyHeader()
                            .AllowAnyMethod()
                            .AllowCredentials();
                    });
                });
            }

            return serviceCollection;
        }
    }
}
