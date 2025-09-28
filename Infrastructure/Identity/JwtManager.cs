using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace Infrastructure.Identity
{
    public class JwtManager : IJwtManager
    {
        private readonly IDateTime dateTime;
        private readonly JwtSettings settings;
        private readonly UserManager<User> userManager;

        public JwtManager(IDateTime dateTime,
        IOptions<JwtSettings> settings,
        UserManager<User> userManager)
        {
            this.dateTime = dateTime;
            this.settings = settings.Value;
            this.userManager = userManager;
        }

        public async Task<string> GenerateAccessTokenAsync(string userCredential)
        {
            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(settings.JwtSecurityKey));

            SigningCredentials credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            User? user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == userCredential || u.Email == userCredential);

            if (user == null)
            {
                throw new NotFoundException(nameof(User), userCredential);
            }

            IEnumerable<Claim> claims = await userManager.GetClaimsAsync(user);

            DateTime expiration = dateTime.Now
                .AddMinutes(settings.AccessTokenExpirationInMinutes);

            JwtSecurityToken token = new JwtSecurityToken(
                issuer: settings.JwtIssuer,
                audience: settings.JwtAudience,
                claims: claims,
                expires: expiration,
                signingCredentials: credentials);

            string accessToken = new JwtSecurityTokenHandler().WriteToken(token);

            return accessToken;
        }

        public async Task<string> GenerateRefreshTokenAsync(string userCredential)
        {
            User? user = await userManager.Users.FirstOrDefaultAsync(u => u.UserName == userCredential || u.Email == userCredential);

            if (user == null)
            {
                throw new NotFoundException(nameof(User), userCredential);
            }

            string refreshToken = string.Empty;
            byte[] randomNumber = new byte[32];

            using (RandomNumberGenerator rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                refreshToken = Convert.ToBase64String(randomNumber);
            }

            user.RefreshToken = refreshToken;
            user.RefreshTokenExpiryTime = dateTime.Now
                .AddMinutes(settings.RefreshTokenExpirationInMinutes);

            await userManager.UpdateAsync(user);

            return refreshToken;
        }

        public async Task<bool> IsValidRefreshTokenAsync(string userId, string refreshToken)
        {
            User? user = await userManager.FindByIdAsync(userId);

            if (user is null)
            {
                throw new NotFoundException(nameof(User), userId);
            }

            bool isValid = user.RefreshToken == refreshToken && user.RefreshTokenExpiryTime > dateTime.Now;

            return isValid;
        }
    }
}
