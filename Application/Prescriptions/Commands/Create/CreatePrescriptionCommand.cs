namespace Application.Prescriptions.Commands.Create;

public class CreatePrescriptionCommand : IRequest<int>
{
    public string? Description { get; set; }

    public int AnimalId { get; set; }
}

public class CreatePrescriptionCommandHandler : IRequestHandler<CreatePrescriptionCommand, int>
{
    private readonly IApplicationDbContext context;
    private readonly ICurrentUserService currentUserService;
    private readonly IDateTime dateTime;

    public CreatePrescriptionCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService, IDateTime dateTime)
    {
        this.context = context;
        this.currentUserService = currentUserService;
        this.dateTime = dateTime;
    }

    public async Task<int> Handle(CreatePrescriptionCommand request, CancellationToken cancellationToken)
    {
        int animalId = request.AnimalId;

        bool animalExists = await context.Animals.AnyAsync(a => a.Id == animalId, cancellationToken);

        if (!animalExists)
        {
            throw new NotFoundException(nameof(Animal), animalId);
        }

        int staffId = int.Parse(currentUserService.StaffId ?? "0");

        bool staffMemberExists = await context.StaffProfiles.AnyAsync(sp => sp.Id == staffId, cancellationToken);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffProfile), staffId);
        }

        PrescriptionCounter? counter = await context.PrescriptionCounters.SingleOrDefaultAsync(cancellationToken);

        if (counter is null)
        {
            throw new NotFoundException(nameof(PrescriptionCounter));
        }

        counter.CurrentNumber++;

        string prescriptionNumber = $"P-{counter.CurrentNumber:D6}";

        bool prescriptionNumberExists = await context.Prescriptions
            .AnyAsync(p => p.Number == prescriptionNumber, cancellationToken);

        if (prescriptionNumberExists)
        {
            List<ValidationFailure> failures = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(prescriptionNumber), "Prescription number already exists!", prescriptionNumber)
            };

            throw new ValidationException(failures);
        }

        Prescription prescription = new Prescription
        {
            Number = prescriptionNumber,
            Description = request.Description,
            IssueDate = dateTime.Now,
            AnimalId = animalId,
            StaffMemberId = staffId
        };

        context.Prescriptions.Add(prescription);

        await context.SaveChangesAsync(cancellationToken);

        return prescription.Id;
    }
}