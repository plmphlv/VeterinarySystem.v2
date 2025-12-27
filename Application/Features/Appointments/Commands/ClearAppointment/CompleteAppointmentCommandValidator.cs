using FluentValidation;

namespace Application.Features.Appointments.Commands.ClearAppointment
{
    public class CompleteAppointmentCommandValidator : AbstractValidator<CompleteAppointmentCommand>
    {
        public CompleteAppointmentCommandValidator()
        {
            RuleFor(c => c.Id)
                .GreaterThan(0)
                .WithMessage("Invalid id");
        }
    }
}
