namespace Application.Features.Procedures.Commands.Delete;

public class DeleteProcedureCommand : IRequest
{
    public int Id { get; set; }
}

public class DeleteProcedureCommandHandler : IRequestHandler<DeleteProcedureCommand>
{
    private readonly IApplicationDbContext context;

    public DeleteProcedureCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(DeleteProcedureCommand request, CancellationToken cancellationToken)
    {
        int procedureId = request.Id;

        Procedure? procedure = await context.Procedures.FirstOrDefaultAsync(p => p.Id == procedureId, cancellationToken);

        if (procedure is null)
        {
            throw new NotFoundException(nameof(procedure), procedureId);
        }

        context.Procedures.Remove(procedure);

        await context.SaveChangesAsync(cancellationToken);
    }
}