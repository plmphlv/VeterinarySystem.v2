namespace Application.Procedures.Queries.SearchProcedures;

public class SearchProceduresQuery : IRequest<List<ProcedureDto>>
{
    public string? StaffMemberName { get; set; }

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

        string? staffMemberName = request.StaffMemberName;

        if (!string.IsNullOrEmpty(staffMemberName))
        {
            staffMemberName = staffMemberName
                .Trim()
                .ToLower();

            proceduresQuery = proceduresQuery.Where(p =>
            p.StaffMember.StaffMember.FirstName.ToLower().Contains(staffMemberName) ||
            p.StaffMember.StaffMember.LastName.ToLower().Contains(staffMemberName) ||
            (p.StaffMember.StaffMember.FirstName + " " + p.StaffMember.StaffMember.LastName).ToLower().Contains(staffMemberName));
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