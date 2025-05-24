using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Application.Common.Models;
using Application.Users.Commands.Common;
using Domain.Entities;
using FluentValidation.Results;
using Infrastructure.Extensions;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace Infrastructure.Identity;

public class IdentityService : IIdentityService
{
    private readonly UserManager<User> userManager;
    private readonly IApplicationDbContext context;

    public IdentityService(UserManager<User> userManager, IApplicationDbContext context)
    {
        this.userManager = userManager;
        this.context = context;
    }

    public async Task<(Result, string?)> CreateUserAsync(UserInputModel model, CancellationToken cancellationToken)
    {
        User user = new User
        {
            UserName = model.UserName,
            Email = model.Email,
        };

        IdentityResult result = await userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
        {
            return (result.ToApplicationResult(), user.Id);
        }

        string firstName = model.FirstName;
        string lastName = model.LastName;
        string phoneNumber = model.PhoneNumber;

        OwnerAccount? account = await context.OwnerAccounts
            .FirstOrDefaultAsync(oa =>
        oa.FirstName == firstName &&
        oa.LastName == lastName &&
        oa.PhoneNumber == phoneNumber &&
        oa.UserId == null,
        cancellationToken);

        if (account is null)
        {
            account = new OwnerAccount
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = firstName,
                LastName = lastName,
                PhoneNumber = phoneNumber
            };

            context.OwnerAccounts.Add(account);
        }

        account.UserId = user.Id;

        List<Claim> claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name,user.UserName),
            new Claim(ClaimTypes.NameIdentifier,user.Id),
            new Claim(ClaimTypes.Email,user.Email),
            new Claim(InfrastructureConstants.AccountId,account.Id)
        };

        IdentityResult claimsResult = await userManager.AddClaimsAsync(user, claims);

        if (!claimsResult.Succeeded)
        {
            return (claimsResult.ToApplicationResult(), user.Id);
        }

        await context.SaveChangesAsync(cancellationToken);

        string token = await userManager.GenerateEmailConfirmationTokenAsync(user);

        return (Result.Success(), token);
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

    public async Task<IdentityResult> AddRoleAsync(string userId, string role)
    {
        User? user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new NotFoundException(nameof(User), userId);
        }

        IdentityResult roleResult = await userManager.AddToRoleAsync(user, role);

        if (!roleResult.Succeeded)
        {
            List<ValidationFailure> validationFailures = roleResult.Errors
                .Select(e => new ValidationFailure(nameof(role), e.Description))
                .ToList();

            throw new ValidationException(validationFailures);
        }

        IdentityResult claimsResult = await userManager.AddClaimAsync(user, new Claim(ClaimTypes.Role, role));

        if (!claimsResult.Succeeded)
        {
            await userManager.RemoveFromRoleAsync(user, role);

            List<ValidationFailure> validationFailures = claimsResult.Errors
                .Select(e => new ValidationFailure(nameof(role), e.Description))
                .ToList();

            throw new ValidationException(validationFailures);
        }

        return roleResult;
    }

    public async Task<IdentityResult> RemoveRoleAsync(string userId, string role)
    {
        User? user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new NotFoundException(nameof(User), userId);
        }

        IdentityResult roleResult = await userManager
            .RemoveFromRoleAsync(user, role);

        if (!roleResult.Succeeded)
        {
            List<ValidationFailure> validationFailures = roleResult.Errors
                .Select(e => new ValidationFailure(nameof(role), e.Description))
                .ToList();

            throw new ValidationException(validationFailures);
        }

        IdentityResult claimsResult = await userManager
            .RemoveClaimAsync(user, new Claim(ClaimTypes.Role, role));

        if (!claimsResult.Succeeded)
        {
            await userManager.RemoveFromRoleAsync(user, role);

            List<ValidationFailure> validationFailures = claimsResult.Errors
                .Select(e => new ValidationFailure(nameof(role), e.Description))
                .ToList();

            throw new ValidationException(validationFailures);
        }

        return roleResult;
    }

    public async Task<Result> ResetPasswordAsync(string userId, string newPassword, CancellationToken cancellationToken)
    {
        User? user = await userManager.FindByIdAsync(userId);

        if (user is null)
        {
            throw new NotFoundException(nameof(User), userId);
        }

        string token = await userManager.GeneratePasswordResetTokenAsync(user);

        IdentityResult result = await userManager.ResetPasswordAsync(user, token, newPassword);

        if (!result.Succeeded)
        {
            return result.ToApplicationResult();
        }

        return Result.Success();
    }
}
