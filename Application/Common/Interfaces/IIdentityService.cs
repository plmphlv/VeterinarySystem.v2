using Application.Users.Commands.Register;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    Task<bool> ValidateLoginAsync(string userIdentifier, string password, CancellationToken cancellationToken);

    Task<string> SetRefreshTokenAsync(string identifier, DateTime refreshTokenExpiryTime, CancellationToken cancellationToken);

    Task<IEnumerable<Claim>> GetUserClaimsAsync(string userIdentifier, CancellationToken cancellationToken);

    Task<string> RegisterUserAsync(RegisterCommand command, CancellationToken cancellationToken);

    Task ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken);

    Task<IdentityResult> AddRoleAsync(string userId, string role, IEnumerable<Claim> claim);

    Task<IdentityResult> RemoveRoleAsync(string userId, string role, IEnumerable<Claim> claims);
}
