namespace Application.StaffProfiles.Queries.GetStaffMembers;

public class GetStaffMembersQuery : IRequest<List<StaffMemberDto>>
{
    public string? Name { get; set; }

    public string? PhoneNumber { get; set; }

    public string? Email { get; set; }
}

public class GetStaffMembersQueryHandler : IRequestHandler<GetStaffMembersQuery, List<StaffMemberDto>>
{
    private readonly IApplicationDbContext context;

    public GetStaffMembersQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<List<StaffMemberDto>> Handle(GetStaffMembersQuery request, CancellationToken cancellationToken)
    {
        IQueryable<StaffAccount> staffQuery = context.StaffAccounts;

        string? name = request.Name;

        if (!string.IsNullOrWhiteSpace(name))
        {
            name = name.Trim().ToLower();

            staffQuery = staffQuery.Where(sp => sp.Account.FirstName.ToLower().Contains(name) ||
            sp.Account.LastName.ToLower().Contains(name) ||
            (sp.Account.FirstName + " " + sp.Account.LastName).ToLower().Contains(name)
            );
        }

        string? phoneNumber = request.PhoneNumber;

        if (!string.IsNullOrWhiteSpace(phoneNumber))
        {
            staffQuery = staffQuery.Where(sp => sp.Account.PhoneNumber!.Equals(phoneNumber));
        }

        string? email = request.Email;

        if (!string.IsNullOrWhiteSpace(email))
        {
            email = email.ToLower();

            staffQuery = staffQuery.Where(sp => sp.Account.User!.Email!.ToLower().Equals(email));
        }

        List<StaffMemberDto> staffMembers = await staffQuery
            .Select(sp => new StaffMemberDto
            {
                Id = sp.Id,
                Name = $"{sp.Account.FirstName} {sp.Account.LastName}"
            })
            .ToListAsync(cancellationToken);

        return staffMembers;
    }
}