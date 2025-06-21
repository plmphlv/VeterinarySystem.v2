namespace Application.Prescriptions.Commands.Update;

public class UpdatePrescriptionCommand : IRequest
{
    public int Id { get; set; }

    public string Description { get; set; } = null!;
}

public class UpdatePrescriptionCommandHandler : IRequestHandler<UpdatePrescriptionCommand>
{
    private readonly IApplicationDbContext context;

    public UpdatePrescriptionCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        Prescription? prescription = await context.Prescriptions
            .FirstOrDefaultAsync(p => p.Id == id, cancellationToken);

        if (prescription is null)
        {
            throw new NotFoundException(nameof(Prescription), id);
        }

        prescription.Description = request.Description;

        await context.SaveChangesAsync(cancellationToken);
    }
}