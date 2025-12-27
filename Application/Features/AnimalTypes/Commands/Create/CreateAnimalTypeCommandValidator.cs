using FluentValidation;

namespace Application.Features.AnimalTypes.Commands.Create;

public class CreateAnimalTypeCommandValidator : AbstractValidator<CreateAnimalTypeCommand>
{
    public CreateAnimalTypeCommandValidator()
    {
        RuleFor(c => c.TypeName)
            .NotEmpty()
            .WithMessage("Animal type name is required.")
            .MaximumLength(45)
            .WithMessage("Animal type name cannot be longer than 45 charecters.");
    }
}
