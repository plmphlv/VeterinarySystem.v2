using FluentValidation;

namespace Application.Appointments.Commands.RequestAppointment;

public class RequestAppointmentCommandValidator : AbstractValidator<RequestAppointmentCommand>
{
    public RequestAppointmentCommandValidator()
    {
        RuleFor(c => c.Date)
            .NotEmpty()
            .WithMessage("Appointment Date is required");

        RuleFor(c => c.StaffId)
            .NotEmpty()
            .WithMessage("StaffMemberId is required.");

        RuleFor(c => c.Desctiption)
          .MaximumLength(255)
          .When(c => !string.IsNullOrEmpty(c.Desctiption))
          .WithMessage("Desctiption cannot be longer than 255 characters.");
    }
}
