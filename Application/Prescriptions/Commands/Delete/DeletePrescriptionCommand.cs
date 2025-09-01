namespace Application.Prescriptions.Commands.Delete;

public class DeletePrescriptionCommand : IRequest
{
    public int Id { get; set; }
}

public class DeletePrescriptionCommandHandler : IRequestHandler<DeletePrescriptionCommand>
{
    private readonly IApplicationDbContext context;

    public DeletePrescriptionCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(DeletePrescriptionCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Prescription? prescription = await context.Prescriptions
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (prescription is null)
        {
            throw new NotFoundException(nameof(Prescription), id);
        }

        context.Prescriptions.Remove(prescription);

        await context.SaveChangesAsync(cancellationToken);
    }
}