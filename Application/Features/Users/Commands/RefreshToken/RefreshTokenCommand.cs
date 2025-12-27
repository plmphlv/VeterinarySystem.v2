using Application.Features.Users.Commands.Login;

namespace Application.Features.Users.Commands.RefreshToken
{
    public class RefreshTokenCommand : IRequest<AuthResponse>
    {
        public string RefreshToken { get; set; } = null!;
    }

    public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, AuthResponse>
    {
        private readonly IJwtManager jwtManager;
        private readonly ICurrentUserService currentUserService;

        public RefreshTokenCommandHandler(IJwtManager jwtManager, ICurrentUserService currentUserService)
        {
            this.jwtManager = jwtManager;
            this.currentUserService = currentUserService;
        }

        public async Task<AuthResponse> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
        {
            string token = request.RefreshToken;

            bool isTokenValid = await jwtManager.IsValidRefreshTokenAsync(currentUserService.UserId!, token);

            if (!isTokenValid)
            {
                return new AuthResponse
                {
                    ErrorMessage = UserMessages.InvalidRefreshToken,
                    IsSuccessful = false,
                    AccessToken = string.Empty,
                    RefreshToken = string.Empty,
                };
            }

            string userName = currentUserService.UserName!;

            string accessToken = await jwtManager.GenerateAccessTokenAsync(userName);
            string refreshToken = await jwtManager.GenerateRefreshTokenAsync(userName);

            return new AuthResponse
            {
                ErrorMessage = string.Empty,
                IsSuccessful = true,
                AccessToken = accessToken,
                RefreshToken = refreshToken
            };
        }
    }
}
