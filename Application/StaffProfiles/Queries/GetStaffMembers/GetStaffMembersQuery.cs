using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

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
		IQueryable<StaffProfile> query = context.StaffProfiles;

		string? name = request.Name;

		if (!string.IsNullOrWhiteSpace(name))
		{
			name = name.ToLower();

			query = query.Where(sp => sp.StaffMember.FirstName.ToLower().Contains(name) ||
			sp.StaffMember.LastName.ToLower().Contains(name) ||
			$"{sp.StaffMember.FirstName} {sp.StaffMember.LastName}".ToLower().Contains(name));
		}

		string? phoneNumber = request.PhoneNumber;

		if (!string.IsNullOrWhiteSpace(phoneNumber))
		{
			query = query.Where(sp => sp.StaffMember.PhoneNumber.Equals(phoneNumber));
		}

		string? email = request.Email;

		if (!string.IsNullOrWhiteSpace(email))
		{
			email = email.ToLower();

			query = query.Where(sp => sp.StaffMember.Email.ToLower().Equals(email));
		}

		List<StaffMemberDto> staffMembers = await query
			.Select(sp => new StaffMemberDto
			{
				Id = sp.Id,
				Name = $"{sp.StaffMember.FirstName} {sp.StaffMember.LastName}"
			})
			.ToListAsync(cancellationToken);

		return staffMembers;
	}
}