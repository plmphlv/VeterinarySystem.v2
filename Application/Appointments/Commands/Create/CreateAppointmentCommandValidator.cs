using FluentValidation;
using System;

namespace Application.Appointments.Commands.Create;

public class CreateAppointmentCommandValidator : AbstractValidator<CreateAppointmentCommand>
{
    public CreateAppointmentCommandValidator(IDateTime dateTime)
    {
        RuleFor(c => c.Date)
            .NotEmpty()
            .WithMessage("Appointment Date is required");

        RuleFor(c => c.StaffId)
            .NotEmpty()
            .WithMessage("Staff Member is required.");

        RuleFor(c => c.OwnerId)
            .NotEmpty()
            .WithMessage("Animal Owner is required.");

        RuleFor(c => c.Date)
            .NotNull()
            .WithMessage("Appointment date is required.")
            .GreaterThanOrEqualTo(dateTime.Now.AddHours(2))
            .WithMessage("Appointment date can only be in the future");

        RuleFor(c => c.Description)
          .MaximumLength(255)
          .When(c => !string.IsNullOrEmpty(c.Description))
          .WithMessage("Description cannot be longer than 255 characters.");
    }
}
