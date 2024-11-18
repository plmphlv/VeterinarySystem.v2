using Domain.Entities;
using Domain.Enums;
using Infrastructure.Settings;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace Infrastructure.Persistence;

public static class ApplicationDbContextSeed
{
	public static async Task SeedRoles(RoleManager<IdentityRole> roleManager)
	{
		//Getting all the roles from the enum
		IEnumerable<string> roles = Enum.GetNames(typeof(Role));

		foreach (string role in roles)
		{
			bool isExistingRole = await roleManager.RoleExistsAsync(role);

			if (!isExistingRole)
			{
				//Create new role if result is unsuccessful
				IdentityResult result = await roleManager.CreateAsync(new IdentityRole(role));
			}
		}
	}

	public static async Task SeedDevelopmentData(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
	{
		AccountSettings superAdminSettings = configuration.GetSection("SuperAdmin").Get<AccountSettings>();

		string firstName = superAdminSettings.FirstName;
		string lastName = superAdminSettings.LastName;
		string username = superAdminSettings.Username;
		string email = superAdminSettings.Email;
		string password = superAdminSettings.Password;
		string? role = superAdminSettings.Role;

		bool isExistingUser = await userManager.Users
			.AnyAsync(u => u.UserName == username);

		if (!isExistingUser)
		{
			User user = new User
			{
				FirstName = firstName,
				LastName = lastName,
				UserName = username,
				Email = email,
				EmailConfirmed = true,
			};

			await userManager.CreateAsync(user, password);

			await userManager.AddToRoleAsync(user, role);

			StaffProffile staffProffile = new StaffProffile
			{
				StaffMember = user,
			};

			context.StaffProffiles.Add(staffProffile);

			await context.SaveChangesAsync();

			List<Claim> claims = new List<Claim>
			{
				new Claim(ClaimTypes.Name, user.UserName),
				new Claim(ClaimTypes.NameIdentifier, user.Id),
				new Claim(ClaimTypes.Email, user.Email),
				new Claim(ClaimTypes.Role, role),
				new Claim(InfrastructureConstants.StaffId, staffProffile.Id.ToString())
			};

			await userManager.AddClaimsAsync(user, claims);
		}
	}
}
