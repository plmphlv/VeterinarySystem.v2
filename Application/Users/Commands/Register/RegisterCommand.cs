using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore.Storage;
using System.Security.Claims;

namespace Application.Users.Commands.Register;

public class RegisterCommand : IRequest
{
	public string UserName { get; set; } = null!;

	public string Email { get; set; } = null!;

	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public string PhoneNumber { get; set; } = null!;

	public string Password { get; set; } = null!;

	public string ConfirmPassword { get; set; } = null!;
}

public class RegisterCommandHandler : IRequestHandler<RegisterCommand>
{
	private readonly IApplicationDbContext context;
	private readonly IIdentityService identityService;

	public RegisterCommandHandler(IApplicationDbContext context, IIdentityService identityService)
	{
		this.context = context;
		this.identityService = identityService;
	}

	public async Task Handle(RegisterCommand request, CancellationToken cancellationToken)
	{
		using IDbContextTransaction transaction = await context.Database
			.BeginTransactionAsync(cancellationToken);

		User user = new User
		{
			Email = request.Email,
			FirstName = request.FirstName,
			LastName = request.LastName,
			UserName = request.UserName,
			PhoneNumber = request.PhoneNumber
		};

		string token = await identityService.RegisterUserAsync(user, request.Password, cancellationToken);

		List<Claim> claims = new List<Claim>
		{
			new Claim (ClaimTypes.Name,user.UserName),
			new Claim (ClaimTypes.Name,user.Id),
			new Claim (ClaimTypes.Email,user.Email)
		};

		await identityService.AddClaimsAsync(user, claims);

		await transaction.CommitAsync(cancellationToken);
	}
}