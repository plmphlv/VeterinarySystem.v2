using FluentValidation;

namespace Application.Appointments.Commands.RequestAppointment;

public class RequestAppointmentCommandValidator : AbstractValidator<RequestAppointmentCommand>
{
    public RequestAppointmentCommandValidator(IDateTime dateTime)
    {
        RuleFor(c => c.Date)
            .NotEmpty()
            .WithMessage("Appointment Date is required");

        RuleFor(c => c.Date)
            .NotNull()
            .WithMessage("Appointment date is required.")
            .GreaterThanOrEqualTo(dateTime.Now.Date.AddDays(1))
            .WithMessage("Requested date can only be in the future");

        RuleFor(c => c.Description)
          .MaximumLength(255)
          .When(c => !string.IsNullOrEmpty(c.Description))
          .WithMessage("Description cannot be longer than 255 characters.");
    }
}
