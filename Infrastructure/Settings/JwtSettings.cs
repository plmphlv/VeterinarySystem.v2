namespace Infrastructure.Settings
{
    public class JwtSettings
    {
        public int AccessTokenExpirationInMinutes { get; set; }

        public int RefreshTokenExpirationInMinutes { get; set; }

        public string JwtSecurityKey { get; set; } = null!;

        public string JwtIssuer { get; set; } = null!;

        public string JwtAudience { get; set; } = null!;
    }
}
