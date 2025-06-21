using Application.Appointments.Common;
using Domain.Enums;

namespace Application.Appointments.Commands.UpdateAppointmentRequest;

public class UpdateAppointmentRequestCommand : AppointmentModel, IRequest
{
    public int Id { get; set; }
}

public class UpdateAppointmentRequestCommandHandler : IRequestHandler<UpdateAppointmentRequestCommand>
{
    private readonly IApplicationDbContext context;

    public UpdateAppointmentRequestCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdateAppointmentRequestCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Appointment? appointment = await context.Appointments
            .FirstOrDefaultAsync(ap => ap.Id == id && ap.Status == AppointmentStatus.Pending_Review, cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), id);
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
        }

        string staffMemberId = request.StaffId;

        bool staffMemberExists = await context.StaffAccounts
            .AnyAsync(sp => sp.Id == staffMemberId, cancellationToken);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffAccount), staffMemberExists);
        }

        appointment.Date = request.Date;
        appointment.Desctiption = request.Description;
        appointment.StaffId = staffMemberId;

        await context.SaveChangesAsync(cancellationToken);
    }
}