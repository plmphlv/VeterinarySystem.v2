using Application.Common.Models;
using Application.Users.Commands.Common;
using Microsoft.AspNetCore.Identity;
using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
    Task<(Result, string?)> CreateUserAsync(UserInputModel model, CancellationToken cancellationToken);

    Task<bool> ValidateLoginAsync(string userIdentifier, string password, CancellationToken cancellationToken);

    Task<string> SetRefreshTokenAsync(string identifier, DateTime refreshTokenExpiryTime, CancellationToken cancellationToken);

    Task<IEnumerable<Claim>> GetUserClaimsAsync(string userIdentifier, CancellationToken cancellationToken);

    Task<Result> ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken);

    Task<IdentityResult> AddClaimsAsync(User user, IEnumerable<Claim> claims);

    Task<IdentityResult> AddRoleAsync(string userId, string role);

    Task<IdentityResult> RemoveRoleAsync(string userId, string role);

    Task<Result> ResetPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken);
}
