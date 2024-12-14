using Domain.Enums;
using System.Data;
using System.Security.Claims;

namespace Application.StaffProfiles.Commands.Create;

public class CreateStafProfileCommand : IRequest<string>
{
    public string UserId { get; set; } = null!;
}

public class CreateStafMemberCommandHandler : IRequestHandler<CreateStafProfileCommand, string>
{
    private readonly IApplicationDbContext context;
    private readonly IIdentityService identityService;

    public CreateStafMemberCommandHandler(IApplicationDbContext context, IIdentityService identityService)
    {
        this.context = context;
        this.identityService = identityService;
    }

    public async Task<string> Handle(CreateStafProfileCommand request, CancellationToken cancellationToken)
    {
        string userId = request.UserId;

        StaffProfile staffProfile = new StaffProfile
        {
            Id = Guid.NewGuid().ToString(),
            StaffMemberId = request.UserId
        };

        context.StaffProfiles.Add(staffProfile);
        await context.SaveChangesAsync(cancellationToken);

        string role = Role.StaffMember.ToString();

        IEnumerable<Claim>  staffClaims = new List<Claim>
        {
            new Claim(ProjectConstants.StaffId, staffProfile.Id),
            new Claim(ClaimTypes.Role, role)
        };

        await identityService.AddRoleAsync(userId, role, staffClaims);

        return staffProfile.Id;
    }
}
