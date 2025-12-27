using Application.Common.Models;

namespace Application.Features.StaffProfiles.Queries.GetStaffMemberesList
{
    public class GetStaffMemberesListQuery : IRequest<List<StaffMemberDropdownModel>>;

    public class GetStaffMemberesListQueryHandler : IRequestHandler<GetStaffMemberesListQuery, List<StaffMemberDropdownModel>>
    {
        private readonly IApplicationDbContext context;
        public GetStaffMemberesListQueryHandler(IApplicationDbContext context)
        {
            this.context = context;
        }
        public async Task<List<StaffMemberDropdownModel>> Handle(GetStaffMemberesListQuery request, CancellationToken cancellationToken)
        {
            List<StaffMemberDropdownModel> staffMembers = await context.StaffAccounts
                .Select(sp => new StaffMemberDropdownModel
                {
                    Id = sp.Id.ToString(),
                    Value = $"{sp.Account.FirstName} {sp.Account.LastName}"
                })
                .ToListAsync(cancellationToken);

            return staffMembers;
        }
    }
}
