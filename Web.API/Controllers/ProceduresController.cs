using Application.Procedures.Commands.Create;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class ProceduresController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> CreateProcedure([FromBody] CreateProcedureCommand command)
    {
        return Ok(await Mediator.Send(command));
    }
}
