using Application.Features.Procedures.Commands.Create;
using Application.Features.Procedures.Commands.Delete;
using Application.Features.Procedures.Commands.Update;
using Application.Features.Procedures.Queries.GetProcedureDetails;
using Application.Features.Procedures.Queries.SearchProcedures;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class ProceduresController : ApiControllerBase
{
    //DO TESTING

    [HttpPost]
    public async Task<ActionResult<int>> CreateProcedure([FromBody] CreateProcedureCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateProcedure([FromRoute] int id, [FromBody] UpdateProcedureCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteProcedure([FromRoute] int id)
    {
        await Mediator.Send(new DeleteProcedureCommand { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ProcedureOutputModel>> GetProcedureDetails([FromRoute] int id)
    {
        return await Mediator.Send(new GetProcedureDetailsQuery { Id = id });
    }

    [HttpGet("SearchProcedures")]
    public async Task<ActionResult<List<ProcedureDto>>> SearchProcedures([FromQuery] SearchProceduresQuery query)
    {
        return await Mediator.Send(query);
    }
}
