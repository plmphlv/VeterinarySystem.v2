using Application.StaffProfiles.Commands.Create;
using Application.StaffProfiles.Commands.Delete;
using Application.StaffProfiles.Queries.GetStaffMemberDetails;
using Application.StaffProfiles.Queries.GetStaffMembers;
using Microsoft.AspNetCore.Mvc;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace Web.API.Controllers;

public class StaffProfileController : ApiControllerBase
{
	[HttpPost]
	public async Task<ActionResult<int>> CreateStaffProfile([FromBody] CreateStafProfileCommand command)
	{
		return await Mediator.Send(command);
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> DeleteStaffProfile([FromRoute] int id)
	{
		await Mediator.Send(new DeleteStaffProfileCommand { Id = id });

		return NoContent();
	}

	[HttpGet("{id}")]
	public async Task<ActionResult<StaffMemberOutputModel>> GetStaffMemberDetails([FromRoute] int id)
	{
		return await Mediator.Send(new GetStaffMemberDetailsQuery { Id = id });
	}

	[HttpGet]
	public async Task<ActionResult<List<StaffMemberDto>>> GetStaffMembers([FromQuery] GetStaffMembersQuery query)
	{
		return await Mediator.Send(query);
	}
}
