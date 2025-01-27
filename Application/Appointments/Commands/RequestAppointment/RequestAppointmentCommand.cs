
using Application.Appointments.Common;
using Domain.Enums;

namespace Application.Appointments.Commands.RequestAppointment;

public class RequestAppointmentCommand : AppointmentModel, IRequest<int>;


public class RequestAppointmentCommandHandler : IRequestHandler<RequestAppointmentCommand, int>
{
    private readonly IApplicationDbContext context;
    private readonly ICurrentUserService currentUserService;

    public RequestAppointmentCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        this.context = context;
        this.currentUserService = currentUserService;
    }

    public async Task<int> Handle(RequestAppointmentCommand request, CancellationToken cancellationToken)
    {
        DateTime appointmentTime = request.Date;

        bool isTimeSlotTaken = await context.Appointments
            .AnyAsync(ap => ap.Date == appointmentTime, cancellationToken);

        if (isTimeSlotTaken)
        {
            List<ValidationFailure> validationFailures = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(appointmentTime),"Time slot is unavailable",appointmentTime)
            };

            throw new ValidationException(validationFailures);
        }

        string? userId = currentUserService.UserId;

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
            throw new NotFoundException(nameof(StaffProfile), staffMemberExists);
        }

        Appointment appointment = new Appointment
        {
            Date = request.Date,
            Desctiption = request.Desctiption,
            Status = AppointmentStatus.Pending_Review,
            AnimalOwnerId = userId!,
            StaffMemberId = staffMemberId,
        };

        context.Appointments.Add(appointment);

        await context.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}
