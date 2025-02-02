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
                //If result is unsuccessful log information after implementing logging
                IdentityResult result = await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    public static async Task SeedPrescriptionCounter(ApplicationDbContext context, IConfiguration configuration)
    {
        PrescriptionCounter? counter = await context.PrescriptionCounters.FirstOrDefaultAsync();

        PrescriptionCounterOptions options = configuration
                    .GetSection("PrescriptionCounter")
                    .Get<PrescriptionCounterOptions>()!;

        if (counter is null)
        {
            string? lastPrescriptionNumber = await context.Prescriptions
            .OrderByDescending(p => p.CreationDate)
            .Select(p => p.Number)
            .FirstOrDefaultAsync();

            if (!string.IsNullOrEmpty(lastPrescriptionNumber))
            {
                counter = new PrescriptionCounter();

                if (char.IsLetter(lastPrescriptionNumber[0]) || char.IsSymbol(lastPrescriptionNumber[0]))
                {
                    counter.CurrentNumber = int.Parse(lastPrescriptionNumber.Substring(2));
                }
                else
                {
                    counter.CurrentNumber = int.Parse(lastPrescriptionNumber);
                }
            }
            else
            {
                counter = new PrescriptionCounter
                {
                    CurrentNumber = options.StartingNumber,
                };
            }

            context.PrescriptionCounters.Add(counter);
        }

        if (counter.ShowPrefix != options.ShowPrefix)
        {
            counter.ShowPrefix = options.ShowPrefix;
        }

        if (!string.IsNullOrEmpty(options.Prefix) && counter.Prefix != options.Prefix)
        {
            counter.Prefix = options.Prefix;
        }

        if (!string.IsNullOrEmpty(options.Separator) && counter.Separator != options.Separator)
        {
            counter.Separator = options.Separator;
        }

        await context.SaveChangesAsync();
    }

    public static async Task SeedDevelopmentData(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
    {
        await SeedUsers(context, userManager, configuration);
        await SeedSampleData(context, userManager);
    }

    private static async Task SeedSampleData(ApplicationDbContext context, UserManager<User> userManager)
    {
        int animalTypesCount = await context.AnimalTypes.CountAsync();

        if (animalTypesCount == 0)
        {
            List<AnimalType> animalTypes = new List<AnimalType>
            {
                new AnimalType{ Name = "Cat" },
                new AnimalType{ Name = "Dog" },
                new AnimalType{ Name = "Bird" },
                new AnimalType{ Name = "Livestock" },
                new AnimalType{ Name = "Transportation Animal" },
                new AnimalType{ Name = "Other mammal" }
            };

            await context.AnimalTypes.AddRangeAsync(animalTypes);
        }

        User? staffUser = await userManager.FindByEmailAsync("staffmember@vetsystem.com");

        if (staffUser is null)
        {
            return;
        }

        Account? staffAccount = await context.Accounts
            .FirstOrDefaultAsync(ac => ac.UserId == staffUser.Id);

        if (staffAccount is null)
        {
            return;
        }

        bool staffExists = await context.StaffAccounts
            .AnyAsync(s => s.AccountId == staffAccount.Id);

        if (!staffExists)
        {
            StaffAccount staff = new StaffAccount
            {
                Id = Guid.NewGuid().ToString(),
                AccountId = staffAccount.Id,
            };

            context.StaffAccounts.Add(staff);
        }

        await context.SaveChangesAsync();
    }

    private static async Task SeedUsers(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
    {
        IConfiguration? usersData = configuration.GetSection("SeedingUserData");

        if (usersData is null)
        {
            return;
        }

        List<AccountSettings>? accountSettings = usersData.Get<List<AccountSettings>>();

        if (accountSettings is null)
        {
            return;
        }

        foreach (AccountSettings setteing in accountSettings)
        {
            await CreateUser(userManager, context, setteing);
        }
    }

    private static async Task CreateUser(UserManager<User> userManager, ApplicationDbContext context, AccountSettings settings)
    {
        string firstName = settings.FirstName;
        string lastName = settings.LastName;
        string username = settings.Username;
        string email = settings.Email;
        string password = settings.Password;
        string? role = settings.Role;

        bool isExistingUser = await userManager.Users
            .AnyAsync(u => u.UserName == username);

        if (!isExistingUser)
        {
            User user = new User
            {
                UserName = username,
                Email = email,
                EmailConfirmed = true,
            };

            IdentityResult result = await userManager.CreateAsync(user, password);

            if (!result.Succeeded)
            {
                return;
            }

            Account account = new Account
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = firstName,
                LastName = lastName,
                UserId = user.Id,
            };

            context.Accounts.Add(account);
            await context.SaveChangesAsync();

            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.UserName),
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(InfrastructureConstants.AccountId, account.Id.ToString())
            };

            if (!string.IsNullOrEmpty(role))
            {
                //TODO: Log in case the result is unsuccessful
                IdentityResult addRoleResult = await userManager.AddToRoleAsync(user, role);

                claims.Add(new Claim(ClaimTypes.Role, role));
                claims.Add(new Claim(InfrastructureConstants.StaffId, role));
            }

            await userManager.AddClaimsAsync(user, claims);
        }
    }
}
