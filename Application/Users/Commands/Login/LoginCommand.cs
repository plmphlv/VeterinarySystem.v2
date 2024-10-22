using Application.Common.Interfaces;
using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace Application.Users.Commands.Login;

public class LoginCommand : IRequest<LoginResponce>
{
	public string IdentifyingCredential { get; set; } = null!;

	public string Password { get; set; } = null!;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, LoginResponce>
{
	private readonly IDateTime dateTime;
	private readonly IConfiguration configuration;
	private readonly IIdentityService identityService;

	public LoginCommandHandler(IDateTime dateTime, IConfiguration configuration, IIdentityService identityService)
	{
		this.dateTime = dateTime;
		this.configuration = configuration;
		this.identityService = identityService;
	}

	public async Task<LoginResponce> Handle(LoginCommand request, CancellationToken cancellationToken)
	{
		string identifyingCredential = request.IdentifyingCredential;
		string password = request.Password;

		bool isValidLogin = await identityService
			.ValidateLoginAsync(identifyingCredential, password, cancellationToken);

		if (!isValidLogin)
		{
			return new LoginResponce
			{
				IsSuccessful = false,
				ErrorMessage = UserMessages.InvalidUser
			};
		}

		string apiKey = configuration.GetSection(ProjectConstants.ApiKey).Value;

		IEnumerable<Claim> claims = await identityService
			.GetUserClaimsAsync(identifyingCredential, cancellationToken);

		SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(apiKey));
		SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

		DateTime expiration = DateTime.Now
			.AddMinutes(45);

		JwtSecurityToken token = new JwtSecurityToken(
			claims: claims,
			expires: expiration,
			signingCredentials: credentials);

		string jwt = new JwtSecurityTokenHandler().WriteToken(token);

		LoginResponce responce = new LoginResponce()
		{
			AccessToken = jwt,
			IsSuccessful = true
		};

		return responce;
	}
}
