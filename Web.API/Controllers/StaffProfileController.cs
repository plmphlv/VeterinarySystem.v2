using Application.StaffProfiles.Commands.Create;
using Application.StaffProfiles.Queries.GetStaffMemberDetails;
using Application.StaffProfiles.Queries.GetStaffMembers;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class StaffProfileController : ApiControllerBase
{
	[HttpPost]
	public async Task<ActionResult<int>> CreateStaffProfile([FromBody] CreateStafProfileCommand command)
	{
		return await Mediator.Send(command);
	}

	[HttpDelete]
	public async Task<ActionResult> DeleteStaffProfile([FromBody] CreateStafProfileCommand command)
	{
		await Mediator.Send(command);

		return NoContent();
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<StaffMemberOutputModel>> GetStaffMemberDetails([FromRoute] GetStaffMemberDetailsQuery query)
	{
		return await Mediator.Send(query);
	}

	[HttpGet]
	public async Task<ActionResult<List<StaffMemberDto>>> GetStaffMembers([FromRoute] GetStaffMembersQuery query)
	{
		return await Mediator.Send(query);
	}
}
