using Application.Common.Models;
using Application.Features.AnimalTypes.Commands.Create;
using Application.Features.AnimalTypes.Commands.Delete;
using Application.Features.AnimalTypes.Commands.Update;
using Application.Features.AnimalTypes.Queries.GetAnimalTypesList;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class AnimalTypesController : ApiControllerBase
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
        await Mediator.Send(new DeleteTypeAnimalCommand { Id = id });

        return NoContent();
    }

    [HttpGet]
    public async Task<ActionResult<List<DropdownModel>>> GetAnimalTypesList()
    {
        return await Mediator.Send(new GetAnimalTypesListQuery());
    }
}
