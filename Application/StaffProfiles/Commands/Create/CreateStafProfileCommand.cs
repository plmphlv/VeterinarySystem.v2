using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;

namespace Application.StaffProfiles.Commands.Create;

public class CreateStafProfileCommand : IRequest<int>
{
	public string UserId { get; set; } = null!;
}

public class CreateStafMemberCommandHandler : IRequestHandler<CreateStafProfileCommand, int>
{
	private readonly IApplicationDbContext context;
	private readonly IIdentityService identityService;

	public CreateStafMemberCommandHandler(IApplicationDbContext context, IIdentityService identityService)
	{
		this.context = context;
		this.identityService = identityService;
	}

	public async Task<int> Handle(CreateStafProfileCommand request, CancellationToken cancellationToken)
	{
		string userId = request.UserId;

		StaffProfile staffProfile = new StaffProfile
		{
			StaffMemberId = request.UserId
		};

		context.StaffProfiles.Add(staffProfile);
		await context.SaveChangesAsync(cancellationToken);

		await identityService.AddRoleAsync(userId, Role.StaffMember.ToString());

		return staffProfile.Id;
	}
}
