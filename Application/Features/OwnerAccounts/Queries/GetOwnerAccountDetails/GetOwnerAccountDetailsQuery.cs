namespace Application.Features.OwnerAccounts.Queries.GetOwnerAccountDetails;

public class GetOwnerAccountDetailsQuery : IRequest<OwnerAccountOutputModel>
{
    public string Id { get; set; } = null!;
}

public class GetOwnerAccountDetailsQueryHandler : IRequestHandler<GetOwnerAccountDetailsQuery, OwnerAccountOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetOwnerAccountDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<OwnerAccountOutputModel> Handle(GetOwnerAccountDetailsQuery request, CancellationToken cancellationToken)
    {
        string id = request.Id;

        OwnerAccountOutputModel? ownerAccount = await context.OwnerAccounts
            .Where(ao => ao.Id == id)
            .Select(ao => new OwnerAccountOutputModel
            {
                Id = ao.Id,
                FirstName = ao.FirstName,
                LastName = ao.LastName,
                PhoneNumber = ao.PhoneNumber,
                Address = ao.Address,
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (ownerAccount == null)
        {
            throw new NotFoundException(nameof(OwnerAccount), id);
        }

        return ownerAccount;
    }
}