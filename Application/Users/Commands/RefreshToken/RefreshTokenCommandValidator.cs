using FluentValidation;

namespace Application.Users.Commands.RefreshToken
{
    public class RefreshTokenCommandValidator:AbstractValidator<RefreshTokenCommand>
    {
        public RefreshTokenCommandValidator()
        {
            RuleFor(c => c.RefreshToken)
            .NotEmpty()
            .WithMessage("Refresh token is required");
        }
    }
}
