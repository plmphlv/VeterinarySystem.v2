using FluentValidation;

namespace Application.Procedures.Commands.Update;

public class UpdateProcedureCommandValidator : AbstractValidator<UpdateProcedureCommand>
{
    public UpdateProcedureCommandValidator()
    {
        RuleFor(c => c.Name)
            .NotEmpty()
            .WithMessage("Procedure name is required.")
            .MaximumLength(90)
            .WithMessage("Procedure name lenght cannot be longer than 90 charecters.");

        RuleFor(c => c.Description)
           .NotEmpty()
           .WithMessage("Procedure description is required.")
           .MaximumLength(1000)
           .WithMessage("Procedure description lenght cannot be longer than 1000 charecters.");

        RuleFor(c => c.Date)
           .NotEmpty()
           .WithMessage("Procedure date is required.");
    }
}
