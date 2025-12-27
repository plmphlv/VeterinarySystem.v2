namespace Application.Features.Users.Commands.Login;

public class LoginCommand : IRequest<AuthResponse>
{
    public string IdentifyingCredential { get; set; } = null!;

    public string Password { get; set; } = null!;
}

public class LoginCommandHandler : IRequestHandler<LoginCommand, AuthResponse>
{

    private readonly IJwtManager jwtManager;
    private readonly IIdentityService identityService;

    public LoginCommandHandler(IJwtManager jwtManager, IIdentityService identityService)
    {
        this.jwtManager = jwtManager;
        this.identityService = identityService;
    }

    public async Task<AuthResponse> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        string identifyingCredential = request.IdentifyingCredential;
        string password = request.Password;

        bool isValidLogin = await identityService
            .ValidateLoginAsync(identifyingCredential, password, cancellationToken);

        if (!isValidLogin)
        {
            return new AuthResponse
            {
                IsSuccessful = false,
                ErrorMessage = UserMessages.InvalidUser
            };
        }

        string accessToken = await jwtManager.GenerateAccessTokenAsync(identifyingCredential);
        string refreshToken = await jwtManager.GenerateRefreshTokenAsync(identifyingCredential);

        return new AuthResponse
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken,
            IsSuccessful = true
        };
    }
}
