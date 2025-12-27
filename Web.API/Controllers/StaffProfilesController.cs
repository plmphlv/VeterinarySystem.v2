using Application.Features.StaffProfiles.Commands.Create;
using Application.Features.StaffProfiles.Commands.Delete;
using Application.Features.StaffProfiles.Queries.GetStaffMemberDetails;
using Application.Features.StaffProfiles.Queries.GetStaffMemberesList;
using Application.Features.StaffProfiles.Queries.GetStaffMembers;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class StaffProfilesController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<string>> CreateStaffProfile([FromBody] CreateStafProfileCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteStaffProfile([FromRoute] string id)
    {
        await Mediator.Send(new DeleteStaffProfileCommand { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<StaffMemberOutputModel>> GetStaffMemberDetails([FromRoute] string id)
    {
        return await Mediator.Send(new GetStaffMemberDetailsQuery { Id = id });
    }

    [HttpGet]
    public async Task<ActionResult<List<StaffMemberDto>>> SearchStaffMembers([FromQuery] SearchStaffMembersQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpGet("GetStaffMembers")]
    public async Task<ActionResult<List<StaffMemberDropdownModel>>> GetStaffMembers()
    {
        return await Mediator.Send(new GetStaffMemberesListQuery());
    }
}
