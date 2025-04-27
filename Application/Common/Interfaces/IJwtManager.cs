namespace Application.Common.Interfaces
{
    public interface IJwtManager
    {
        Task<string> GenerateAccessTokenAsync(string userCredential);

        Task<string> GenerateRefreshTokenAsync(string userCredential);

        Task<bool> IsValidRefreshTokenAsync(string userId, string refreshToken);
    }
}
