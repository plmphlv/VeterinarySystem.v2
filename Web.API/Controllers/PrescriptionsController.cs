using Application.Prescriptions.Commands.Create;
using Application.Prescriptions.Commands.Delete;
using Application.Prescriptions.Commands.Update;
using Application.Prescriptions.Queries.GetPrescription;
using Application.Prescriptions.Queries.GetPrescriptionDetails;
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

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeletePrescription([FromRoute] int id)
    {
        await Mediator.Send(new DeletePrescriptionCommand { Id = id });

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<PrescriptionOutputModel>> GetPrescriptionDetails([FromRoute] int id)
    {
        return await Mediator.Send(new GetPrescriptionDetailsQuery { Id = id });
    }

    [HttpGet]
    public async Task<ActionResult<List<PrescriptionDto>>> GetPrescriptions([FromQuery] GetPrescriptionQuery query)
    {
        return await Mediator.Send(query);
    }
}
