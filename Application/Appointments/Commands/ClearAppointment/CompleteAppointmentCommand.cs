using Domain.Enums;

namespace Application.Appointments.Commands.ClearAppointment;

public class CompleteAppointmentCommand : IRequest
{
    public int Id { get; set; }
}

public class CompleteAppointmentCommandHandler : IRequestHandler<CompleteAppointmentCommand>
{
    private readonly IApplicationDbContext context;

    public CompleteAppointmentCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(CompleteAppointmentCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Appointment? appointment = await context.Appointments
            .FirstOrDefaultAsync(ap => ap.Id == id && ap.Status == AppointmentStatus.Confirmed, cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), id);
        }

        appointment.Status = AppointmentStatus.Completed;

        await context.SaveChangesAsync(cancellationToken);
    }
}