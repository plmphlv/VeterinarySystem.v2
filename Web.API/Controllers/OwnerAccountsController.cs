using Application.OwnerAccounts.Commands.Create;
using Application.OwnerAccounts.Commands.Delete;
using Application.OwnerAccounts.Commands.Update;
using Application.OwnerAccounts.Queries.GetAnimalOwners;
using Application.OwnerAccounts.Queries.GetOwnerAccountDetails;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class OwnerAccountsController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<string>> CreateOwnerAccount([FromBody] CreateOwnerAccountCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> CreateOwnerAccount([FromRoute] string id, [FromBody] UpdateOwnerAccountCommand command)
    {
        if (!string.Equals(id, command.Id))
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteOwnerAccount([FromRoute] string id)
    {
        await Mediator.Send(new DeleteOwnerAccountCommand { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<OwnerAccountOutputModel>> GetOwnerAccountDetails([FromRoute] string id)
    {
        return await Mediator.Send(new GetOwnerAccountDetailsQuery { Id = id });
    }

    [HttpGet("SearchOwners")]
    public async Task<ActionResult<List<OwnerAccountDto>>> GetAnimalOwners([FromQuery] GetAnimalOwnersQuery query)
    {
        return await Mediator.Send(query);
    }
}
