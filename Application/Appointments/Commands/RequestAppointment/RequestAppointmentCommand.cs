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
        string? ownerId = currentUserService.AccountId;

        bool ownerExists = await context.OwnerAccounts
            .AnyAsync(u => u.Id == ownerId, cancellationToken);

        if (!ownerExists)
        {
            throw new NotFoundException(nameof(OwnerAccount), ownerId);
        }

        string staffMemberId = request.StaffId;

        bool staffMemberExists = await context.StaffAccounts
            .AnyAsync(sp => sp.Id == staffMemberId, cancellationToken);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffAccount), staffMemberExists);
        }

        Appointment appointment = new Appointment
        {
            Date = request.Date,
            Desctiption = request.Desctiption,
            Status = AppointmentStatus.Pending_Review,
            AnimalOwnerId = ownerId!,
            StaffId = staffMemberId,
        };

        context.Appointments.Add(appointment);

        await context.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}
