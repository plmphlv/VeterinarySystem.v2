using FluentValidation;

namespace Application.Appointments.Commands.Create;

public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
{
    public CreateAppointmentCommandValidator()
    {
        RuleFor(c => c.Date)
            .NotEmpty()
            .WithMessage("Appointment Date is required");

        RuleFor(c => c.StaffMemberId)
            .NotEmpty()
            .WithMessage("StaffMemberId is required.");

        RuleFor(c => c.AnimalOwnerId)
            .NotEmpty()
            .WithMessage("AnimalOwnerId is required.");

        RuleFor(c => c.Desctiption)
          .MaximumLength(255)
          .When(c => !string.IsNullOrEmpty(c.Desctiption))
          .WithMessage("Desctiption cannot be longer than 255 characters.");
    }
}
