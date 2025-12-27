using Application.Common.Models;
using Application.Features.Users.Commands.Register;

namespace Application.Features.Users.Commands.ChangePassword
{
    public class ChangePasswordCommand : IRequest
    {
        public string CurrentPassword { get; set; } = null!;

        public string NewPassword { get; set; } = null!;

        public string ConfirmNewPassword { get; set; } = null!;
    }

    public class ChangePasswordCommandHandler : IRequestHandler<ChangePasswordCommand>
    {
        private readonly ICurrentUserService currentUserService;
        private readonly IIdentityService identityService;

        public ChangePasswordCommandHandler(ICurrentUserService currentUserService, IIdentityService identityService)
        {
            this.currentUserService = currentUserService;
            this.identityService = identityService;
        }

        public async Task Handle(ChangePasswordCommand request, CancellationToken cancellationToken)
        {
            string? userId = currentUserService.UserId;

            if (string.IsNullOrEmpty(userId))
            {
                throw new ForbiddenAccessException();
            }

            Result result = await identityService.ChangePasswordAsync(userId, request.CurrentPassword, request.NewPassword, cancellationToken);

            if (!result.Succeeded)
            {
                throw new ValidationException(
                    result.Errors.Select(e => new ValidationFailure(nameof(RegisterCommand), e)));
            }
        }
    }
}
