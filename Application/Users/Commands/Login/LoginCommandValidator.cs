using FluentValidation;

namespace Application.Users.Commands.Login
{
	public class LoginCommandValidator : AbstractValidator<LoginCommand>
	{
		public LoginCommandValidator()
		{
			RuleFor(c => c.IdentifyingCredential)
				.NotEmpty()
				.WithMessage("Enter email or username");

			RuleFor(c => c.Password)
				.NotEmpty()
				.WithMessage("Enter password")
				.MinimumLength(8)
				.WithMessage("Password must be at least 8 characters long");
		}
	}
}
