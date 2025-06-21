using FluentValidation;
using System;

namespace Application.Appointments.Commands.UpdateAppointmentRequest
{
    public class UpdateAppointmentRequestCommandValidator : AbstractValidator<UpdateAppointmentRequestCommand>
    {
        public UpdateAppointmentRequestCommandValidator(IDateTime dateTime)
        {
            RuleFor(c => c.Id)
                .GreaterThan(0)
                .WithMessage("Invalid id");

            RuleFor(c => c.StaffId)
                .NotEmpty()
                .WithMessage("StaffMemberId is required.");

            RuleFor(c => c.Date)
                .NotNull()
                .WithMessage("Appointment date is required.")
                .GreaterThanOrEqualTo(dateTime.Now.Date.AddDays(1))
                .WithMessage("Requested date can only be in the future");

            RuleFor(c => c.Description)
              .MaximumLength(255)
              .When(c => !string.IsNullOrEmpty(c.Description))
              .WithMessage("Desctiption cannot be longer than 255 characters.");
        }
    }
}
