namespace Application.Features.StaffProfiles.Queries.GetStaffMemberDetails;

public class GetStaffMemberDetailsQuery : IRequest<StaffMemberOutputModel>
{
    public string Id { get; set; } = null!;
}

public class GetStaffMemberDetailsQueryHandler : IRequestHandler<GetStaffMemberDetailsQuery, StaffMemberOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetStaffMemberDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<StaffMemberOutputModel> Handle(GetStaffMemberDetailsQuery request, CancellationToken cancellationToken)
    {
        string? id = request.Id;

        StaffMemberOutputModel? result = await context.StaffAccounts
            .Where(sp => sp.Id == id)
            .Select(sp => new StaffMemberOutputModel
            {
                Id = sp.Id,
                Name = $"{sp.Account.FirstName} {sp.Account.LastName}",
                PhoneNumber = sp.Account.PhoneNumber!
            }).FirstOrDefaultAsync(cancellationToken);

        if (result is null)
        {
            throw new NotFoundException(nameof(StaffAccount), id);
        }

        return result;
    }
}
