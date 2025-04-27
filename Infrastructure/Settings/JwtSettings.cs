namespace Infrastructure.Settings
{
    public class JwtSettings
    {
        public int AccessTokenExpirationInMinutes { get; set; }

        public int RefreshTokenExpirationInMinutes { get; set; }
    }
}
