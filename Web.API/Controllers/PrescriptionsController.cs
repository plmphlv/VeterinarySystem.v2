using Application.Prescriptions.Commands.Create;
using Application.Prescriptions.Commands.Update;
using Application.Procedures.Commands.Update;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class PrescriptionsController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> CreatePrescription([FromBody] CreatePrescriptionCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdatePrescription([FromRoute] int id, [FromBody] UpdatePrescriptionCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }
}
