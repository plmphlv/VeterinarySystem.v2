using Application.Users.Commands.Login;
using Application.Users.Commands.Register;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class UserController : ApiControllerBase
{
	[HttpPost("Login")]
	public async Task<ActionResult<LoginResponce>> Login([FromBody] LoginCommand command)
	{
		return await Mediator.Send(command);
	}

	[HttpPost("Register")]
	public async Task<ActionResult> Register([FromBody] RegisterCommand command)
	{
		await Mediator.Send(command);

		return NoContent();
	}
}
