using Application.Common.Behaviours;
using FluentValidation;
using MediatR;
using Microsoft.Extensions.DependencyInjection;
using System.Reflection;

namespace Application;

public static class ConfigureServices
{
	public static IServiceCollection AddApplication(this IServiceCollection services)
	{
		services.AddValidatorsFromAssembly(Assembly.GetExecutingAssembly());
		services.AddMediatR(cfg => cfg.RegisterServicesFromAssemblies(AppDomain.CurrentDomain.GetAssemblies()));
		services.AddTransient(typeof(IPipelineBehavior<,>), typeof(UnhandledExceptionBehaviour<,>));
		services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehaviour<,>));
		services.AddTransient(typeof(IPipelineBehavior<,>), typeof(PerformanceBehaviour<,>));
		services.AddAutoMapper(Assembly.GetExecutingAssembly());


		return services;
	}
}
