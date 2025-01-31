using Application.Prescriptions.Commands.Create;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class PrescriptionsController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> CreatePrescription([FromBody] CreatePrescriptionCommand command)
    {
        return await Mediator.Send(command);
    }
}
