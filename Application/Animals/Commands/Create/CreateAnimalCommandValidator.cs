﻿using FluentValidation;

namespace Application.Animals.Commands.Create;

public class CreateAnimalCommandValidator : AbstractValidator<CreateAnimalCommand>
{
    public CreateAnimalCommandValidator()
    {
        RuleFor(c => c.Name)
            .MaximumLength(60)
            .When(c => !string.IsNullOrEmpty(c.Name))
            .WithMessage("Animal name cannot be longer than 60 characters.");

        RuleFor(c => c.Weight)
            .NotEmpty()
            .WithMessage("Animal weight is required.")
            .GreaterThan(0)
            .WithMessage("Weight cannot be less than 0 kg.");

        RuleFor(c => c.PassportNumber)
           .MaximumLength(15)
           .When(c => !string.IsNullOrEmpty(c.PassportNumber))
           .WithMessage("Passport number cannot be longer than 15 characters.");

        RuleFor(c => c.ChipNumber)
           .MaximumLength(15)
           .When(c => !string.IsNullOrEmpty(c.ChipNumber))
           .WithMessage("Chip number cannot be longer than 15 characters.");

        RuleFor(c => c.OwnerId)
            .NotEmpty()
            .WithMessage("Animal owner is required.");

        RuleFor(c => c.AnimalTypeId)
            .NotNull()
            .WithMessage("Animal type is required.")
            .GreaterThan(0)
            .WithMessage("Invalid animal type id.");

        RuleFor(c => c.Age)
            .GreaterThanOrEqualTo(0)
            .When(c => c.Age.HasValue)
            .WithMessage("Age cannot be less than 0 years.");
    }
}
