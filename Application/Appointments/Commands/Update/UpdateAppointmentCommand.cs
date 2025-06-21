using Application.Appointments.Common;
using Domain.Enums;

namespace Application.Appointments.Commands.Update;

public class UpdateAppointmentCommand : AppointmentModel, IRequest
{
    public int Id { get; set; }

    public AppointmentStatus Status { get; set; }
}

public class UpdateAppointmentCommandHandler : IRequestHandler<UpdateAppointmentCommand>
{
    public readonly IApplicationDbContext context;

    public UpdateAppointmentCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdateAppointmentCommand request, CancellationToken cancellationToken)
    {
        int appointmentId = request.Id;

        Appointment? appointment = await context.Appointments
            .FirstOrDefaultAsync(ap => ap.Id == appointmentId, cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), appointmentId);
        }

        DateTime newAppointmentTime = request.Date;

        if (appointment.Date != newAppointmentTime)
        {

            bool isTimeSlotTaken = await context.Appointments
                .AnyAsync(ap => ap.Date == newAppointmentTime, cancellationToken);

            if (isTimeSlotTaken)
            {
                List<ValidationFailure> validationFailures = new List<ValidationFailure>
                {
                new ValidationFailure(nameof(newAppointmentTime), "Time slot is unavailable", newAppointmentTime)
                };

                throw new ValidationException(validationFailures);
            }

            appointment.Date = request.Date;
        }

        string staffMemberId = request.StaffId;

        if (appointment.StaffId != staffMemberId)
        {
            bool staffMemberExists = await context.StaffAccounts
                .AnyAsync(sp => sp.Id == staffMemberId);

            if (!staffMemberExists)
            {
                throw new NotFoundException(nameof(StaffAccount), staffMemberExists);
            }

            appointment.StaffId = request.StaffId;
        }

        appointment.Desctiption = request.Description;
        appointment.Status = request.Status;

        await context.SaveChangesAsync(cancellationToken);
    }
}