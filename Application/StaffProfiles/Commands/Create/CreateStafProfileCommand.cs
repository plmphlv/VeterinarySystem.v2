using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;

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

        StaffAccount staffProfile = new StaffAccount
        {
            AccountId = request.UserId
        };

        context.StaffAccounts.Add(staffProfile);
        await context.SaveChangesAsync(cancellationToken);

        await identityService.AddRoleAsync(userId, Role.StaffMember.ToString());

        return staffProfile.Id;
    }
}
