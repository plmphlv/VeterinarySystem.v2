namespace Application.Procedures.Queries.GetProcedureDetails;

public class GetProcedureDetailsQuery : IRequest<ProcedureOutputModel>
{
    public int Id { get; set; }
}

public class GetProcedureDetailsQueryHandler : IRequestHandler<GetProcedureDetailsQuery, ProcedureOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetProcedureDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<ProcedureOutputModel> Handle(GetProcedureDetailsQuery request, CancellationToken cancellationToken)
    {
        int procedureId = request.Id;

        ProcedureOutputModel? procedure = await context.Procedures
            .Where(p => p.Id == procedureId)
            .Select(p => new ProcedureOutputModel
            {
                Id = procedureId,
                Name = p.Name,
                Description = p.Description,
                Date = p.Date,
                AnimalId = p.AnimalId,
                AnimalName = p.Animal.Name!,
                StaffMemberName = $"{p.StaffProfile.Account.FirstName} {p.StaffProfile.Account.LastName}"
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (procedure == null)
        {
            throw new NotFoundException(nameof(Procedure), procedureId);
        }

        return procedure;
    }
}