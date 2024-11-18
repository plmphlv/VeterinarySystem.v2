﻿using Domain.Entities;
using System.Security.Claims;

namespace Application.Common.Interfaces;

public interface IIdentityService
{
	Task<bool> ValidateLoginAsync(string userIdentifier, string password, CancellationToken cancellationToken);

	Task<string> SetRefreshTokenAsync(string identifier, DateTime refreshTokenExpiryTime, CancellationToken cancellationToken);

	Task<IEnumerable<Claim>> GetUserClaimsAsync(string userIdentifier, CancellationToken cancellationToken);

	Task<string> RegisterUserAsync(User user, string password, CancellationToken cancellationToken);

	Task ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken);
}
