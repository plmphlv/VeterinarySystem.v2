using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Domain.Enums;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.StaffProfiles.Commands.Delete;

public class DeleteStaffProfileCommand : IRequest
{
	public int Id { get; set; }
}

public class DeleteStaffProfileCommandHandler : IRequestHandler<DeleteStaffProfileCommand>
{
	private readonly IApplicationDbContext context;
	private readonly IIdentityService identityService;

	public DeleteStaffProfileCommandHandler(IApplicationDbContext context, IIdentityService identityService)
	{
		this.context = context;
		this.identityService = identityService;
	}

	public async Task Handle(DeleteStaffProfileCommand request, CancellationToken cancellationToken)
	{
		int staffId = request.Id;

		StaffProfile? staffProfile = await context.StaffProfiles
			.FirstOrDefaultAsync(sp => sp.Id == staffId, cancellationToken);

		if (staffProfile is null)
		{
			throw new NotFoundException(nameof(StaffProfiles), staffId);
		}

		context.StaffProfiles.Remove(staffProfile);
		await context.SaveChangesAsync(cancellationToken);

		await identityService.RemoveRoleAsync(staffProfile.StaffMemberId, Role.StaffMember.ToString());
	}
}