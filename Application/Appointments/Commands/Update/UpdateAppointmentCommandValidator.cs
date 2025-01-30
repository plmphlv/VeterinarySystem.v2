using FluentValidation;

namespace Application.Appointments.Commands.Update
{
    public class UpdateAppointmentCommandValidator : AbstractValidator<UpdateAppointmentCommand>
    {
        public UpdateAppointmentCommandValidator()
        {
            RuleFor(c => c.Id)
               .GreaterThan(0)
               .WithMessage("Invalid Appointment Id.");

            RuleFor(c => c.Date)
                .NotEmpty()
                .WithMessage("Appointment Date is required");

            RuleFor(c => c.StaffMemberId)
                .NotEmpty()
                .WithMessage("StaffMemberId is required.");

            RuleFor(c => c.Status)
                .NotEmpty()
                .WithMessage("AppointmentStatus is required.")
                .IsInEnum()
                .WithMessage("Invalid AppointmentStatus");

            RuleFor(c => c.Desctiption)
              .MaximumLength(255)
              .When(c => !string.IsNullOrEmpty(c.Desctiption))
              .WithMessage("Desctiption cannot be longer than 255 characters.");
        }
    }
}
