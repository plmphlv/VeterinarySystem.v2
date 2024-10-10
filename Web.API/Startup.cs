using Application;
using Common.Interfaces;
using Filters;
using FluentValidation.AspNetCore;
using Infrastructure;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using NSwag;
using NSwag.Generation.Processors.Security;
using Persistence;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Text.Json.Serialization;
using Web.API.Services;

namespace Web.API;

public class Startup
{
	public Startup(IConfiguration configuration)
	{
		Configuration = configuration;
	}

	public IConfiguration Configuration { get; }

	public void ConfigureServices(IServiceCollection services)
	{
		services.AddApplication();

		services.AddInfrastructure(Configuration);

		services.AddDatabaseDeveloperPageExceptionFilter();

		services.AddScoped<ICurrentUserService, CurrentUserService>();

		services.AddHttpContextAccessor();

		services.AddHealthChecks().AddDbContextCheck<ApplicationDbContext>();

		services.AddControllersWithViews(options =>
		   options.Filters.Add<ApiExceptionFilterAttribute>());

		services.AddFluentValidationAutoValidation()
			.AddFluentValidationClientsideAdapters();

		// Customise default API behaviour
		services.Configure<ApiBehaviorOptions>(options =>
			options.SuppressModelStateInvalidFilter = true);

		services.AddOpenApiDocument(configure =>
		{
			configure.Title = "VeterinarySystem Web.API";
			configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
			{
				Type = OpenApiSecuritySchemeType.ApiKey,
				Name = "Authorization",
				In = OpenApiSecurityApiKeyLocation.Header,
				Description = "Type into the textbox: Bearer {your JWT token}."
			});
			configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
		});


		services.AddControllers().AddJsonOptions(opts =>
		{
			opts.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
			opts.JsonSerializerOptions.DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull;
		});

		//services.AddAuthorization();
		//string key = Guid.NewGuid().ToString();
		string key = Configuration.GetValue<string>("ApiKey")!;
		services.AddAuthentication("Bearer")
			.AddJwtBearer("Bearer", options =>
			{
				options.TokenValidationParameters = new TokenValidationParameters
				{
					ValidateAudience = false,
					//TBD
					ValidateIssuer = false,
					IssuerSigningKey = new SymmetricSecurityKey(
							Encoding.UTF8.GetBytes(key)),
				};
			});

		services.AddAuthorizationBuilder()
			.AddPolicy("AuthenticatedUser", policy =>
			{
				policy.RequireAuthenticatedUser();
			});
	}

	// This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
	public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
	{
		app.UseCors(builder =>
		{
			{
				builder.AllowAnyOrigin()
				.AllowAnyHeader()
				.AllowAnyMethod();
			}
		});

		app.UseHealthChecks("/health");
		app.UseHttpsRedirection();
		app.UseStaticFiles();

		app.UseOpenApi();
		app.UseSwaggerUi();

		app.UseRouting();

		app.UseAuthentication();
		app.UseAuthorization();

		JwtSecurityTokenHandler.DefaultOutboundClaimTypeMap.Clear();

		app.UseEndpoints(endpoints =>
		{
			endpoints.MapControllerRoute(
				name: "default",
				pattern: "{controller}/{action=Index}/{id?}").RequireAuthorization("ApiScope");

		});
	}
}
