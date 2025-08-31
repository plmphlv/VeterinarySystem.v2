using Application.Appointments.Commands.ClearAppointment;
using Application.Appointments.Commands.Create;
using Application.Appointments.Commands.Delete;
using Application.Appointments.Commands.RequestAppointment;
using Application.Appointments.Commands.Update;
using Application.Appointments.Commands.UpdateAppointmentRequest;
using Application.Appointments.Queries.GetAppointmentDetails;
using Application.Appointments.Queries.GetAppointments;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class AppointmentsController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> CreateAppointment([FromBody] CreateAppointmentCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult<int>> UpdateAppointment([FromRoute] int id, [FromBody] UpdateAppointmentCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpPost("RequestAppointment")]
    public async Task<ActionResult<int>> RequestAppointment([FromBody] RequestAppointmentCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("UpdateAppointmentRequest/{id}")]
    public async Task<ActionResult<int>> UpdateAppointmentRequest([FromRoute] int id, [FromBody] UpdateAppointmentRequestCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpGet("{id}")]
    public async Task<AppointmentOutputModel> GetAppointmentDetails([FromRoute] int id)
    {
        return await Mediator.Send(new GetAppointmentDetailsQuery { Id = id });
    }

    [HttpGet("GetAppointments")]
    public async Task<List<AppointmentDto>> GetAppointments([FromQuery] GetAppointmentsQuery query)
    {
        return await Mediator.Send(query);
    }

    [HttpPut("CompleteAppointment/{id}")]
    public async Task<ActionResult<int>> CompleteAppointment([FromRoute] int id)
    {
        await Mediator.Send(new CompleteAppointmentCommand { Id = id });

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<int>> DeleteAppointment([FromRoute] int id)
    {
        await Mediator.Send(new DeleteAppointmentCommand { Id = id });

        return NoContent();
    }
}
