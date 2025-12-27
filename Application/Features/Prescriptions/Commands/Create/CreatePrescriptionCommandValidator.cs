using Application.Features.Prescriptions.Commands.Create;
using FluentValidation;

namespace Application.Prescriptions.Commands.Create
{
    public class CreatePrescriptionCommandValidator:AbstractValidator<CreatePrescriptionCommand>
    {
        public CreatePrescriptionCommandValidator() 
        {
            RuleFor(c => c.AnimalId)
                .GreaterThan(0)
                .WithMessage("Invalid AnimalId");

            RuleFor(c => c.Description)
                .NotNull()
                .WithMessage("Prescription description is required")
                .MaximumLength(1000)
                .WithMessage("Prescription description cannot be longer than 1000 characters");
        }
    }
}
