namespace Application.Appointments.Commands.Delete;

public class DeleteAppointmentCommand : IRequest
{
    public int Id { get; set; }
}

public class DeleteAppointmentCommandHandler : IRequestHandler<DeleteAppointmentCommand>
{
    private readonly IApplicationDbContext context;

    public DeleteAppointmentCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(DeleteAppointmentCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Appointment? appointment = await context.Appointments
            .FirstOrDefaultAsync(ap => ap.Id == id, cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), id);
        }

        context.Appointments.Remove(appointment);

        await context.SaveChangesAsync(cancellationToken);
    }
}