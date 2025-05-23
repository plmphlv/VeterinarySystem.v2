namespace Application.OwnerAccounts.Commands.Delete;

public class DeleteOwnerAccountCommand : IRequest
{
    public string Id { get; set; } = null!;
}

public class DeleteOwnerAccountCommandHandler : IRequestHandler<DeleteOwnerAccountCommand>
{
    private readonly IApplicationDbContext context;
    public DeleteOwnerAccountCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(DeleteOwnerAccountCommand request, CancellationToken cancellationToken)
    {
        string id = request.Id;

        OwnerAccount? ownerAccount = await context.OwnerAccounts
            .FirstOrDefaultAsync(ao => ao.Id == id && ao.User == null, cancellationToken);

        if (ownerAccount is null)
        {
            throw new NotFoundException(nameof(OwnerAccount), id);
        }

        context.OwnerAccounts.Remove(ownerAccount);

        await context.SaveChangesAsync(cancellationToken);
    }
}