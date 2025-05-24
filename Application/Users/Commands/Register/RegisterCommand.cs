using Application.Common.Models;
using Application.Helpers;
using Application.Users.Commands.Common;

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
        UserInputModel model = new UserInputModel
        {
            UserName = request.UserName,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = PhoneNumberFormatter.Standardize(request.PhoneNumber),
            Password = request.Password
        };

        (Result result, string? token) = await identityService.CreateUserAsync(model, cancellationToken);

        if (!result.Succeeded)
        {
            throw new ValidationException(
                result.Errors.Select(e => new ValidationFailure(nameof(RegisterCommand), e)));
        }
    }
}