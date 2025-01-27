using Domain.Enums;

namespace Application.Appointments.Commands.ClearAppointment;

public class ClearAppointmentCommand : IRequest
{
    public int Id { get; set; }
}

public class ClearAppointmentCommandHandler : IRequestHandler<ClearAppointmentCommand>
{
    private readonly IApplicationDbContext context;

    public ClearAppointmentCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(ClearAppointmentCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Appointment? appointment = await context.Appointments
            .FirstOrDefaultAsync(ap => ap.Id == id, cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), id);
        }

        appointment.Status = AppointmentStatus.Completed;

        await context.SaveChangesAsync(cancellationToken);
    }
}