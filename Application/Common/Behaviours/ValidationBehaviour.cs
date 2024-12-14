using FluentValidation;
using FluentValidation.Results;
using MediatR;

namespace Application.Common.Behaviours;

public class ValidationBehaviour<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse> where TRequest : notnull
{

	private readonly IEnumerable<IValidator<TRequest>> validators;

	public ValidationBehaviour(IEnumerable<IValidator<TRequest>> validators)
	{
		this.validators = validators;
	}

	public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
	{
		var context = new ValidationContext<TRequest>(request);

		ValidationResult[] validationResult = await Task.WhenAll(
			validators.Select(v =>
			v.ValidateAsync(context, cancellationToken)));

		var failures = validationResult
			.Where(r => r.Errors.Any())
			.SelectMany(r => r.Errors)
			.ToList();

		if (failures.Any())
		{
			throw new ValidationException(failures);
		}

		return await next();
	}
}
