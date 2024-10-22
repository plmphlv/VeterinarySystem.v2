using Application.Users.Commands.Login;
using Microsoft.AspNetCore.Mvc;

namespace Web.API.Controllers;

public class UserController : ApiControllerBase
{
	[HttpPost("Login")]
	public async Task<ActionResult<LoginResponce>> Login([FromBody] LoginCommand command)
	{
		return await Mediator.Send(command);
	}
}
