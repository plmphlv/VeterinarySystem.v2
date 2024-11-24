using Application.Animals.Commands.Create;
using Application.Animals.Commands.Delete;
using Application.Animals.Commands.Update;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class AnimalsController : ApiControllerBase
{
	[HttpPost]
	public async Task<ActionResult<int>> CreateAnimal([FromBody] CreateAnimalCommand command)
	{
		return await Mediator.Send(command);
	}

	[HttpPut("{id}")]
	public async Task<ActionResult> UpdateAnimal([FromRoute] int id, [FromBody] UpdateAnimalCommand command)
	{
		if (id != command.Id)
		{
			return BadRequest();
		}

		await Mediator.Send(command);

		return NoContent();
	}

	[HttpDelete("{id}")]
	public async Task<ActionResult> DeleteAnimal([FromRoute] int id)
	{
		await Mediator.Send(new DeleteAnimalCommand { Id = id });

		return NoContent();
	}
}
