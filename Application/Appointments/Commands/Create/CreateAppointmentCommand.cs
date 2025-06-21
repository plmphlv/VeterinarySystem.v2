using Application.Appointments.Common;
using Domain.Enums;

namespace Application.Appointments.Commands.Create;

public class CreateAppointmentCommand : AppointmentModel, IRequest<int>
{
    public string OwnerId { get; set; } = null!;
}

public class CreateAppointmentCommandHadler : IRequestHandler<CreateAppointmentCommand, int>
{
    private readonly IApplicationDbContext context;

    public CreateAppointmentCommandHadler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<int> Handle(CreateAppointmentCommand request, CancellationToken cancellationToken)
    {
        string staffMemberId = request.StaffId;

        bool staffMemberExists = await context.StaffAccounts
            .AnyAsync(sp => sp.Id == staffMemberId, cancellationToken);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffAccount), staffMemberId);
        }

        DateTime appointmentTime = request.Date;

        bool isTimeSlotTaken = await context.Appointments
            .AnyAsync(ap => ap.Date == appointmentTime && ap.StaffId == staffMemberId, cancellationToken);

        if (isTimeSlotTaken)
        {
            List<ValidationFailure> validationFailures = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(appointmentTime), "Time slot is unavailable", appointmentTime)
            };

            throw new ValidationException(validationFailures);
        }

        string ownerId = request.OwnerId;

        bool ownerExists = await context.OwnerAccounts
            .AnyAsync(o => o.Id == ownerId, cancellationToken);

        if (!ownerExists)
        {
            throw new NotFoundException(nameof(OwnerAccount), ownerId);
        }

        Appointment appointment = new Appointment
        {
            Date = request.Date,
            Desctiption = request.Description,
            Status = AppointmentStatus.Confirmed,
            AnimalOwnerId = ownerId,
            StaffId = staffMemberId,
        };

        context.Appointments.Add(appointment);

        await context.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}