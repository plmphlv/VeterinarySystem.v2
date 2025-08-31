using FluentValidation;

namespace Application.AnimalTypes.Commands.Update;

public class UpdateAnimalTypeCommandValidator : AbstractValidator<UpdateAnimalTypeCommand>
{
    public UpdateAnimalTypeCommandValidator()
    {
        RuleFor(c => c.TypeName)
            .NotEmpty()
            .WithMessage("Animal type name is required.")
            .MaximumLength(45)
            .WithMessage("Animal type name cannot be longer than 45 charecters.");
    }
}
