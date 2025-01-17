using Application.Procedures.Common;

namespace Application.Procedures.Commands.Create;

public class CreateProcedureCommand : ProcedureModel, IRequest<int>
{
    public int AnimalId { get; set; }
}

public class CreateProcedureCommandHandler : IRequestHandler<CreateProcedureCommand, int>
{
    private readonly IApplicationDbContext context;
    private readonly ICurrentUserService currentUserService;

    public CreateProcedureCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        this.context = context;
        this.currentUserService = currentUserService;
    }

    public async Task<int> Handle(CreateProcedureCommand request, CancellationToken cancellationToken)
    {
        string? staffClaim = currentUserService.StaffId;

        if (string.IsNullOrWhiteSpace(staffClaim))
        {
            throw new UnauthorizedAccessException("Opperation has beel terminated due to invalid user credentials.");
        }

        int staffId = int.Parse(staffClaim);
        bool staffMemberExists = await context.StaffProfiles.AnyAsync(sp => sp.Id == staffId);

        if (!staffMemberExists)
        {
            throw new NotFoundException(nameof(StaffProfile), staffId);
        }

        int animalId = request.AnimalId;
        bool animalExists = await context.Animals.AnyAsync(a => a.Id == animalId);

        if (!animalExists)
        {
            throw new NotFoundException(nameof(Animal), animalId);
        }

        Procedure procedure = new Procedure
        {
            Name = request.Name,
            Description = request.Description,
            Date = request.Date,
            AnimalId = animalId,
            StaffMemberId = staffId
        };

        context.Procedures.Add(procedure);
        await context.SaveChangesAsync(cancellationToken);

        return procedure.Id;
    }
}