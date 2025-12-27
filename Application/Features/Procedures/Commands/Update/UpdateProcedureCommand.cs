using Application.Features.Procedures.Common;

namespace Application.Features.Procedures.Commands.Update;

public class UpdateProcedureCommand : ProcedureModel, IRequest
{
    public int Id { get; set; }
}

public class UpdateProcedureCommandHandler : IRequestHandler<UpdateProcedureCommand>
{
    private readonly IApplicationDbContext context;

    public UpdateProcedureCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdateProcedureCommand request, CancellationToken cancellationToken)
    {
        int procedureId = request.Id;

        Procedure? procedure = await context.Procedures.FirstOrDefaultAsync(p => p.Id == procedureId, cancellationToken);

        if (procedure is null)
        {
            throw new NotFoundException(nameof(procedure), procedureId);
        }

        procedure.Name = request.Name;
        procedure.Description = request.Description;
        procedure.Date = request.Date;

        await context.SaveChangesAsync(cancellationToken);
    }
}