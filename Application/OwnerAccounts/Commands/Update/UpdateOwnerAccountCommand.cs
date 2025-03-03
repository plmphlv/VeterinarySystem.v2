using Application.OwnerAccounts.Common;

namespace Application.OwnerAccounts.Commands.Update;

public class UpdateOwnerAccountCommand : OwnerAccountModel, IRequest
{
    public string Id { get; set; } = null!;
}

public class UpdateOwnerAccountCommandHandler : IRequestHandler<UpdateOwnerAccountCommand>
{
    private readonly IApplicationDbContext context;

    public UpdateOwnerAccountCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdateOwnerAccountCommand request, CancellationToken cancellationToken)
    {
        string id = request.Id;

        OwnerAccount? ownerAccount = await context.OwnerAccounts
            .FirstOrDefaultAsync(ao => ao.Id == id && ao.User == null, cancellationToken);

        if (ownerAccount is null)
        {
            throw new NotFoundException(nameof(OwnerAccount), id);
        }

        ownerAccount.FirstName = request.FirstName;
        ownerAccount.LastName = request.LastName;
        ownerAccount.Address = request.Address;
        ownerAccount.PhoneNumber = request.PhoneNumber;

        await context.SaveChangesAsync(cancellationToken);
    }
}