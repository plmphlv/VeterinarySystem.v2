﻿namespace Application.StaffProfiles.Queries.GetStaffMembers;

public abstract class StaffMemberModel
{
	public int Id { get; set; }

	public string Name { get; set; } = null!;
}
