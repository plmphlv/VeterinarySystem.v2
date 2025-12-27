using Application.Features.StaffProfiles.Common;

namespace Application.Features.StaffProfiles.Queries.GetStaffMemberDetails;

public class StaffMemberOutputModel : StaffMemberModel
{
	public string PhoneNumber { get; set; } = null!;
}