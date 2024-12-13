using Application.Animals.Commands.Delete;
using Application.AnimalTypes.Commands.Create;
using Application.AnimalTypes.Commands.Update;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class AnimalTypeController : ApiControllerBase
{
    [HttpPost]
    public async Task<ActionResult<int>> CreateAnimalType([FromBody] CreateAnimalTypeCommand command)
    {
        return await Mediator.Send(command);
    }

    [HttpPut("{id}")]
    public async Task<ActionResult> UpdateAnimalType([FromRoute] int id, [FromBody] UpdateAnimalTypeCommand command)
    {
        if (id != command.Id)
        {
            return BadRequest();
        }

        await Mediator.Send(command);

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult> DeleteAnimalType([FromRoute] int id)
    {
        await Mediator.Send(new DeleteAnimalCommand { Id = id });

        return NoContent();
    }
}
