using FluentValidation;

namespace Application.Users.Commands.ResetPassword;

internal class ResetPasswordCommandValidator : AbstractValidator<ResetPasswordCommand>
{
    public ResetPasswordCommandValidator()
    {
        RuleFor(c => c.UserId)
            .NotEmpty()
            .WithMessage("User Id is required.");

        RuleFor(c => c.NewPassword)
            .NotEmpty()
            .WithMessage("New password is required")
            .MinimumLength(8)
            .WithMessage("Password must be at least 8 charecters long.")
            .Must(p => p.Any(char.IsLower))
            .WithMessage("Password must contain at least 1 lowercase charecter.")
            .Must(p => p.Any(char.IsUpper))
            .WithMessage("Password must contain at least 1 uppercase charecter.")
            .Must(p => p.Any(char.IsDigit))
            .WithMessage("Password must contain at least 1 digit.");

        RuleFor(c => c.ConfirmNewPassword)
            .Equal(c => c.NewPassword)
            .WithMessage("Passwords did not match.");
    }
}