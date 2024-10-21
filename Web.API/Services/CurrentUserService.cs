using Application.Common.Interfaces;
using System.Security.Claims;

namespace Web.API.Services
{
	public class CurrentUserService : ICurrentUserService
	{
		private readonly IHttpContextAccessor httpContextAccessor;
		public CurrentUserService(IHttpContextAccessor httpContextAccessor)
		{
			this.httpContextAccessor = httpContextAccessor;
		}

		public string? UserId => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.NameIdentifier);

		public string? UserName => httpContextAccessor.HttpContext?.User.FindFirstValue(ClaimTypes.Name);
	}
}
