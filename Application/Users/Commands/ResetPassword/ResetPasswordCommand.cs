using Application.Common.Models;

namespace Application.Users.Commands.ResetPassword;

public class ResetPasswordCommand : IRequest
{
    public string UserId { get; set; } = null!;

    public string NewPassword { get; set; } = null!;

    public string ConfirmNewPassword { get; set; } = null!;
}

public class ResetPasswordCommandHandler : IRequestHandler<ResetPasswordCommand>
{
    private readonly IIdentityService identityService;

    public ResetPasswordCommandHandler(IIdentityService identityService)
    {
        this.identityService = identityService;
    }

    public async Task Handle(ResetPasswordCommand request, CancellationToken cancellationToken)
    {
        string userId = request.UserId;
        string newPassword = request.NewPassword;

        Result result = await identityService.ResetPasswordAsync(userId, newPassword, cancellationToken);

        if (!result.Succeeded)
        {
            List<ValidationFailure> validationFailures = result.Errors
                .Select(e => new ValidationFailure { ErrorMessage = e })
                .ToList();

            throw new ValidationException(validationFailures);
        }
    }
}
