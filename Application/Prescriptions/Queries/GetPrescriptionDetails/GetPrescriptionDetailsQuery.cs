namespace Application.Prescriptions.Queries.GetPrescriptionDetails;

public class GetPrescriptionDetailsQuery : IRequest<PrescriptionOutputModel>
{
    public int Id { get; set; }
}

public class GetPrescriptionDetailsQueryHandler : IRequestHandler<GetPrescriptionDetailsQuery, PrescriptionOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetPrescriptionDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<PrescriptionOutputModel> Handle(GetPrescriptionDetailsQuery request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        PrescriptionOutputModel? prescription = await context.Prescriptions
            .Where(p => p.Id == id)
            .Select(p => new PrescriptionOutputModel
            {
                Id = p.Id,
                Number = p.Number,
                IssueDate = p.IssueDate,
                StaffName = $"{p.StaffProfile.Account.FirstName} {p.StaffProfile.Account.LastName}",
                Description = p.Description,
                AnimalId = p.AnimalId,
                AnimalName = p.Animal.Name ?? $"Unnamed {p.Animal.AnimalType.Name}",
                OwnerName = $"{p.Animal.Owner.FirstName} {p.Animal.Owner.LastName}"
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (prescription is null)
        {
            throw new NotFoundException(nameof(Prescription), id);
        }

        return prescription;
    }
}