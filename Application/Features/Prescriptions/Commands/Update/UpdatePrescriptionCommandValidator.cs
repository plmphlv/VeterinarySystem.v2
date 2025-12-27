using FluentValidation;

namespace Application.Prescriptions.Commands.Update
{
    public class UpdatePrescriptionCommandValidator:AbstractValidator<UpdatePrescriptionCommand>
    {
        public UpdatePrescriptionCommandValidator() 
        {
            RuleFor(c => c.Id)
                .GreaterThan(0)
                .WithMessage("Invalid Id");

            RuleFor(c => c.Description)
                .NotNull()
                .WithMessage("Prescription description is required")
                .MaximumLength(1000)
                .WithMessage("Prescription description cannot be longer than 1000 characters");
        }
    }
}
