using FluentValidation;
using System;

namespace Application.Appointments.Commands.Update
{
    public class UpdateAppointmentCommandValidator : AbstractValidator<UpdateAppointmentCommand>
    {
        public UpdateAppointmentCommandValidator(IDateTime dateTime)
        {
            RuleFor(c => c.Id)
               .GreaterThan(0)
               .WithMessage("Invalid Appointment Id.");

            RuleFor(c => c.StaffId)
                .NotEmpty()
                .WithMessage("Staff Member is required.");

            RuleFor(c => c.Status)
                .NotEmpty()
                .WithMessage("Appointment Status is required.")
                .IsInEnum()
                .WithMessage("Invalid AppointmentStatus");

            RuleFor(c => c.Date)
                .NotNull()
                .WithMessage("Appointment date is required.")
                .GreaterThanOrEqualTo(dateTime.Now.AddHours(2))
                .WithMessage("Requested time can only be in the future");

            RuleFor(c => c.Description)
              .MaximumLength(255)
              .When(c => !string.IsNullOrEmpty(c.Description))
              .WithMessage("Description cannot be longer than 255 characters.");
        }
    }
}
