using Application.Appointments.Common;
using Domain.Enums;

namespace Application.Appointments.Commands.Create;

public class CreateAppointmentCommand : AppointmentModel, IRequest<int>
{
    public string AnimalOwnerId { get; set; } = null!;
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
        DateTime appointmentTime = request.Date;

        bool isTimeSlotTaken = await context.Appointments
            .AnyAsync(ap => ap.Date == appointmentTime, cancellationToken);

        if (isTimeSlotTaken)
        {
            List<ValidationFailure> validationFailures = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(appointmentTime), "Time slot is unavailable", appointmentTime)
            };

            throw new ValidationException(validationFailures);
        }

        string userId = request.AnimalOwnerId;

        bool ownerExists = await context.Users
            .AnyAsync(u => u.Id == userId, cancellationToken);

        if (!ownerExists)
        {
            throw new NotFoundException(nameof(User), userId);
        }

        int staffMemberId = request.StaffMemberId;

        bool staffMemberExists = await context.StaffProfiles
            .AnyAsync(sp => sp.Id == staffMemberId, cancellationToken);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffProfile), staffMemberId);
        }

        Appointment appointment = new Appointment
        {
            Date = request.Date,
            Desctiption = request.Desctiption,
            Status = AppointmentStatus.Confirmed,
            AnimalOwnerId = userId,
            StaffMemberId = staffMemberId,
        };

        context.Appointments.Add(appointment);

        await context.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}