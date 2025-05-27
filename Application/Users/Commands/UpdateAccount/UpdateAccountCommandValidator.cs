using FluentValidation;

namespace Application.Users.Commands.UpdateAccount
{
    public class UpdateAccountCommandValidator : AbstractValidator<UpdateAccountCommand>
    {
        public UpdateAccountCommandValidator()
        {
            RuleFor(c => c.FirstName).NotEmpty()
                .WithErrorCode("First name is required")
                .MaximumLength(69)
                .WithMessage("First name cannot be longer than 69 charecters");

            RuleFor(c => c.LastName)
                .NotEmpty()
                .WithMessage("Last name is required")
                .MaximumLength(69)
                .WithMessage("Last name cannot be longer than 69 charecters");

            RuleFor(c => c.PhoneNumber)
                .NotEmpty()
                .WithMessage("Phone number is required")
                .MinimumLength(10)
                .WithMessage("Invalid phone number")
                .MaximumLength(16)
                .WithMessage("Phone number cannot be longer than 16 charecters");

            RuleFor(c => c.Address)
                .MaximumLength(69)
                .When(c => !string.IsNullOrEmpty(c.Address))
                .WithMessage("Address cannot be longer than 69 charecters");
        }
    }
}
