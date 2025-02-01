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

        await context.SaveChangesAsync();
    }

    private static async Task SeedUsers(ApplicationDbContext context, UserManager<User> userManager, IConfiguration configuration)
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

            StaffProfile staffProffile = new StaffProfile
            {
                StaffMember = user,
            };

            context.StaffProfiles.Add(staffProffile);

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
