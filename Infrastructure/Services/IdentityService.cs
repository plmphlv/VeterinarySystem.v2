using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using FluentValidation.Results;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Services;

public class IdentityService : IIdentityService
{
	private readonly UserManager<User> userManager;
	private readonly IApplicationDbContext context;

	public IdentityService(UserManager<User> userManager, IApplicationDbContext context)
	{
		this.userManager = userManager;
		this.context = context;
	}

	private async Task<User?> FindUserByUsernameOrEmailAsync(string userIdentifier)
	{
		User? user = await userManager.Users
			.FirstOrDefaultAsync(u => u.UserName == userIdentifier || u.Email == userIdentifier);

		return user;
	}

	public async Task<bool> ValidateLoginAsync(string userIdentifier, string password, CancellationToken cancellationToken)
	{
		User? user = await FindUserByUsernameOrEmailAsync(userIdentifier);

		if (user is null)
		{
			throw new NotFoundException(nameof(User), userIdentifier);
		}

		bool isValidPassword = await userManager.CheckPasswordAsync(user, password);

		return isValidPassword;
	}

	public async Task<string> RegisterUserAsync(User user, string password, CancellationToken cancellationToken)
	{
		bool isExistingUser = await userManager.Users
			.AnyAsync(u => u.Email == user.Email || u.UserName == user.UserName, cancellationToken);

		if (isExistingUser)
		{
			throw new ValidationException(new List<ValidationFailure> {
				new ValidationFailure{ ErrorMessage = "Username or email is already in use" } });
		}

		IdentityResult result = await userManager.CreateAsync(user, password);

		if (!result.Succeeded)
		{
			IEnumerable<ValidationFailure> failures = result.Errors
				.Select(e => new ValidationFailure(e.Code, e.Description));

			throw new ValidationException(failures);
		}

		string token = await userManager.GenerateEmailConfirmationTokenAsync(user);

		return token;
	}

	public Task ChangePasswordAsync(string userId, string currentPassword, string newPassword, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}

	public Task<string> SetRefreshTokenAsync(string identifier, DateTime refreshTokenExpiryTime, CancellationToken cancellationToken)
	{
		throw new NotImplementedException();
	}

	public async Task<IEnumerable<Claim>> GetUserClaimsAsync(string userIdentifier, CancellationToken cancellationToken)
	{
		User? user = await FindUserByUsernameOrEmailAsync(userIdentifier);

		if (user is null)
		{
			throw new NotFoundException(nameof(User), userIdentifier);
		}

		IEnumerable<Claim> claims = await userManager.GetClaimsAsync(user);

		return claims;
	}

	public async Task<IdentityResult> AddClaimsAsync(User user, IEnumerable<Claim> claims)
	{
		IdentityResult claimsResult = await userManager.AddClaimsAsync(user, claims);

		if (!claimsResult.Succeeded)
		{
			List<ValidationFailure> validationFailures = claimsResult.Errors
				.Select(e => new ValidationFailure(nameof(Claim), e.Description))
				.ToList();

			throw new ValidationException(validationFailures);
		}

		return claimsResult;
	}
}
