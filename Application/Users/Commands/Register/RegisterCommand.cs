using Application.Common.Models;

namespace Application.Users.Commands.Register;

public class RegisterCommand : IRequest
{
	public string UserName { get; set; } = null!;

	public string Email { get; set; } = null!;

	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public string PhoneNumber { get; set; } = null!;

	public string Password { get; set; } = null!;

	public string ConfirmPassword { get; set; } = null!;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand>
{
	private readonly IApplicationDbContext context;
	private readonly IIdentityService identityService;

	public RegisterCommandHandler(IApplicationDbContext context, IIdentityService identityService)
	{
		this.context = context;
		this.identityService = identityService;
	}

	public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
        (Result result, string? token) = await identityService.CreateUserAsync(request, cancellationToken);

        if (!result.Succeeded)
        {
            throw new ValidationException(
                result.Errors.Select(e => new ValidationFailure(nameof(RegisterCommand), e)));
        }
    }
}