namespace Application.Features.Procedures.Queries.SearchProcedures;

public class SearchProceduresQuery : IRequest<List<ProcedureDto>>
{
    public string? StaffId { get; set; }

    public int? AnimalId { get; set; }

    public string? ProcedureName { get; set; }

    public string? Description { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}

public class SearchProceduresQueryHandler : IRequestHandler<SearchProceduresQuery, List<ProcedureDto>>
{
    private readonly IApplicationDbContext context;
    private readonly IDateTime dateTime;

    public SearchProceduresQueryHandler(IApplicationDbContext context, IDateTime dateTime)
    {
        this.context = context;
        this.dateTime = dateTime;
    }

    public async Task<List<ProcedureDto>> Handle(SearchProceduresQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Procedure> proceduresQuery = context.Procedures;

        string? staffId = request.StaffId;

        if (!string.IsNullOrEmpty(staffId))
        {
            proceduresQuery = proceduresQuery
                .Where(p => p.StaffId == staffId);
        }

        int? animalId = request.AnimalId;

        if (animalId.HasValue)
        {
            proceduresQuery = proceduresQuery
               .Where(p => p.AnimalId == animalId);
        }

        string? procedureName = request.ProcedureName;

        if (!string.IsNullOrEmpty(procedureName))
        {
            procedureName = procedureName
                .Trim()
                .ToLower();

            proceduresQuery = proceduresQuery
                .Where(p => p.Name.ToLower().Contains(procedureName));
        }

        string? description = request.Description;

        if (!string.IsNullOrEmpty(description))
        {
            description = description
                .Trim()
                .ToLower();

            proceduresQuery = proceduresQuery
                .Where(p => p.Description.ToLower().Contains(description));
        }

        DateTime? startDate = request.StartDate;

        if (startDate.HasValue)
        {
            DateTime? endDate = request.EndDate;

            if (!endDate.HasValue)
            {
                endDate = dateTime.Now;
            }

            proceduresQuery = proceduresQuery
                    .Where(p => p.Date >= startDate && p.Date <= endDate);
        }

        List<ProcedureDto> procedures = await proceduresQuery
            .Select(p => new ProcedureDto
            {
                Id = p.Id,
                Name = p.Name,
                Date = p.Date
            })
            .ToListAsync(cancellationToken);

        return procedures;
    }
}