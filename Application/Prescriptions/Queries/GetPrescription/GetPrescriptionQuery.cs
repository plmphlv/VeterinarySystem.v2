namespace Application.Prescriptions.Queries.GetPrescription;

public class GetPrescriptionQuery : IRequest<List<PrescriptionDto>>
{
    public int? AnimalId { get; set; }

    public string? StaffId { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public string? PrescriptionNumber { get; set; }
}

public class GGetPrescriptionQueryHandler : IRequestHandler<GetPrescriptionQuery, List<PrescriptionDto>>
{
    private readonly IApplicationDbContext context;

    public GGetPrescriptionQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<List<PrescriptionDto>> Handle(GetPrescriptionQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Prescription> prescriptions = context.Prescriptions;

        int? animalId = request.AnimalId;

        if (animalId.HasValue)
        {
            prescriptions = prescriptions
                .Where(p => p.AnimalId == animalId);
        }

        string? staffId = request.StaffId;

        if (!string.IsNullOrEmpty(staffId))
        {
            prescriptions = prescriptions
                .Where(p => p.StaffId == staffId);
        }

        DateTime? startDate = request.StartDate;
        DateTime? endDate = request.EndDate;

        if (startDate is not null || endDate is not null)
        {
            if (startDate is not null && endDate is not null)
            {
                prescriptions = prescriptions
                    .Where(ap => ap.IssueDate >= startDate && ap.IssueDate <= endDate);
            }
            else if (startDate is not null)
            {
                prescriptions = prescriptions
                    .Where(ap => ap.IssueDate >= startDate);
            }
            else if (endDate is not null)
            {
                prescriptions = prescriptions
                    .Where(ap => ap.IssueDate <= endDate);
            }
        }

        string? prescriptionNumber = request.PrescriptionNumber;

        if (!string.IsNullOrEmpty(prescriptionNumber))
        {
            prescriptions = prescriptions
                .Where(p => p.Number == prescriptionNumber);
        }

        List<PrescriptionDto> prescriptionDtos = await prescriptions
            .Select(p => new PrescriptionDto
            {
                Id = p.Id,
                Number = p.Number,
                IssueDate = p.IssueDate,
                StaffName = $"{p.StaffProfile.Account.FirstName} {p.StaffProfile.Account.LastName}"
            })
            .ToListAsync(cancellationToken);

        return prescriptionDtos;
    }
}