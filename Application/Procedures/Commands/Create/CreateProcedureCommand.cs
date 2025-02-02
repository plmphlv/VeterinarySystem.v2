using Application.Procedures.Common;

namespace Application.Procedures.Commands.Create;

public class CreateProcedureCommand : ProcedureModel, IRequest<int>
{
    public int AnimalId { get; set; }
    public string StaffId { get; set; } = null!;
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
        string? staffId = request.StaffId;

        bool staffExists = await context.StaffAccounts
            .AnyAsync(sp => sp.Id == staffId);

        if (!staffExists)
        {
            throw new NotFoundException(nameof(StaffAccount), staffId);
        }

        int animalId = request.AnimalId;

        bool animalExists = await context.Animals
            .AnyAsync(a => a.Id == animalId);

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
            StaffId = staffId
        };

        context.Procedures.Add(procedure);

        await context.SaveChangesAsync(cancellationToken);

        return procedure.Id;
    }
}