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

    private readonly IJwtManager jwtManager;
    private readonly IIdentityService identityService;

    public LoginCommandHandler(IJwtManager jwtManager, IIdentityService identityService)
    {
        this.jwtManager = jwtManager;
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

        string accessToken = await jwtManager.GenerateAccessTokenAsync(identifyingCredential);
        string refreshToken = await jwtManager.GenerateRefreshTokenAsync(identifyingCredential);

        return new LoginResponce
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsSuccessful = true
        };
    }
}
