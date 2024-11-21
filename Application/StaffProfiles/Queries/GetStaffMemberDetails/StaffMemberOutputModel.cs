using Application.StaffProfiles.Common;

namespace Application.StaffProfiles.Queries.GetStaffMemberDetails;

public class StaffMemberOutputModel : StaffMemberModel
{
	public string PhoneNumber { get; set; } = null!;
}