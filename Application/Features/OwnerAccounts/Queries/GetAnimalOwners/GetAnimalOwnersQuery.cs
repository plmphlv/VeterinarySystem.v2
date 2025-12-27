namespace Application.Features.OwnerAccounts.Queries.GetAnimalOwners;

public class GetAnimalOwnersQuery : IRequest<List<OwnerAccountDto>>
{
    public string? Name { get; set; }

    public string? Email { get; set; }

    public string? PhoneNumber { get; set; }
}

public class GetAnimalOwnersQueryHandler : IRequestHandler<GetAnimalOwnersQuery, List<OwnerAccountDto>>
{
    private readonly IApplicationDbContext context;

    public GetAnimalOwnersQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<List<OwnerAccountDto>> Handle(GetAnimalOwnersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<OwnerAccount> query = context.OwnerAccounts;

        string? name = request.Name;

        if (!string.IsNullOrEmpty(name))
        {
            name = name.Trim().ToLower();

            query = query.Where(ao =>
            ao.FirstName.ToLower().Contains(name) ||
            ao.LastName.ToLower().Contains(name) ||
            (ao.FirstName + " " + ao.LastName).ToLower().Contains(name));
        }

        string? phoneNumber = request.PhoneNumber;

        if (!string.IsNullOrEmpty(phoneNumber))
        {
            phoneNumber = phoneNumber.Trim().ToUpper();

            query = query.Where(ao => ao.PhoneNumber == phoneNumber);
        }

        string? email = request.Email;

        if (!string.IsNullOrEmpty(email))
        {
            email = email.Trim().ToUpper();

            query = query.Where(ao => ao.User != null && ao.User.NormalizedEmail == email);
        }

        List<OwnerAccountDto> ownerAccounts = await query.Select(ao => new OwnerAccountDto
        {
            Id = ao.Id,
            FullName = $"{ao.FirstName} {ao.LastName}",
            PhoneNumber = ao.PhoneNumber
        }).ToListAsync(cancellationToken);

        return ownerAccounts;
    }
}