using FluentValidation;

namespace Application.Users.Commands.Register;

public class RegisterCommandValidator : AbstractValidator<RegisterCommand>
{
	public RegisterCommandValidator()
	{
		RuleFor(c => c.Email)
			.NotEmpty()
			.EmailAddress();

		RuleFor(c => c.Password)
			.NotEmpty()
			.MinimumLength(8);

		RuleFor(c => c.ConfirmPassword)
			.Equal(c => c.Password)
			.WithMessage("Passwords do not match");

		RuleFor(c => c.FirstName)
			.NotEmpty()
			.WithMessage("First name is required");

		RuleFor(c => c.LastName)
			.NotEmpty()
			.WithMessage("Last name is required");

		RuleFor(c => c.UserName)
			.NotEmpty()
			.WithMessage("User name is required");
	}
}
