using Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Application.Common.Behaviours;

public class PerformanceBehaviour<TRequest, TResponce> : IPipelineBehavior<TRequest, TResponce> where TRequest : notnull
{
	private readonly Stopwatch timer;
	private readonly ILogger<TRequest> logger;
	private readonly ICurrentUserService currentUserService;

	public PerformanceBehaviour(ILogger<TRequest> logger,
		ICurrentUserService currentUserService)
	{
		this.logger = logger;
		this.currentUserService = currentUserService;
		timer = new Stopwatch();
	}

	public async Task<TResponce> Handle(TRequest request, RequestHandlerDelegate<TResponce> next, CancellationToken cancellationToken)
	{
		timer.Start();

		TResponce response = await next();

		timer.Stop();

		long elapsedMilliseconds = timer.ElapsedMilliseconds;

		if (elapsedMilliseconds > 0)
		{
			string requestName = typeof(TRequest).Name;
			string userId = currentUserService.UserId ?? string.Empty;


			logger.LogWarning("Long Running Request: {Name} ({ElapsedMilliseconds} milliseconds) {@UserId} {@Request}",
				requestName, elapsedMilliseconds, userId, request);
		}

		return response;
	}
}
