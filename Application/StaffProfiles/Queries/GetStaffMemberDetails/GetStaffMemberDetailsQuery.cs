using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.StaffProfiles.Queries.GetStaffMemberDetails;

public class GetStaffMemberDetailsQuery : IRequest<StaffMemberOutputModel>
{
	public int Id { get; set; }
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
		int id = request.Id;

		StaffMemberOutputModel? result = await context.StaffProfiles
			.Where(sp => sp.Id == id)
			.Select(sp => new StaffMemberOutputModel
			{
				Id = sp.Id,
				Name = $"{sp.StaffMember.FirstName} {sp.StaffMember.LastName}",
				PhoneNumber = sp.StaffMember.PhoneNumber
			}).FirstOrDefaultAsync(cancellationToken);

		if (result is null)
		{
			throw new NotFoundException(nameof(StaffProfile), id);
		}

		return result;
	}
}
