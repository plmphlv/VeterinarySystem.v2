using Application.Features.Appointments.Common;
using Domain.Enums;

namespace Application.Features.Appointments.Commands.RequestAppointment;

public class RequestAppointmentCommand : AppointmentRequestModel, IRequest<int>;


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

        Appointment appointment = new Appointment
        {
            Date = request.Date,
            Description = request.Description,
            Status = AppointmentStatus.Pending_Review,
            AnimalOwnerId = ownerId!
        };

        context.Appointments.Add(appointment);

        await context.SaveChangesAsync(cancellationToken);

        return appointment.Id;
    }
}
