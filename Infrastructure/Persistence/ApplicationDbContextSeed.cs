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
        await SeedPrescriptionCounter(context, configuration);
        await SeedUsers(context, userManager, configuration);
        await SeedSampleData(context, userManager);
    }

    private static async Task SeedSampleData(ApplicationDbContext context, UserManager<User> userManager)
    {
        #region UsersAndAccounts

        User? staffUser = await userManager.FindByEmailAsync("staffmember@vetsystem.com");

        if (staffUser is null)
        {
            return;
        }

        User? ownerUser = await userManager.FindByEmailAsync("testuser@vetsystem.com");

        if (ownerUser is null)
        {
            return;
        }

        OwnerAccount? staffAccount = await context.OwnerAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(ac => ac.UserId == staffUser.Id);

        if (staffAccount is null)
        {
            return;
        }

        OwnerAccount? ownerAccount = await context.OwnerAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(ac => ac.UserId == ownerUser.Id);

        if (ownerAccount is null)
        {
            return;
        }


        OwnerAccount? unregiteredOwner = await context.OwnerAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(uo => uo.User == null);

        if (unregiteredOwner is null)
        {
            unregiteredOwner = new OwnerAccount
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = "Kiril",
                LastName = "Draganov",
                PhoneNumber = "+359 88 666 9004"
            };

            context.OwnerAccounts.Add(unregiteredOwner);
        }

        StaffAccount? staff = await context.StaffAccounts
            .AsNoTracking()
            .FirstOrDefaultAsync(s => s.AccountId == staffAccount.Id);

        if (staff is null)
        {
            return;
        }

        int animalTypesCount = await context.AnimalTypes.CountAsync();

        int animalsCount = await context.Animals.CountAsync();

        #endregion

        if (animalTypesCount == 0 && animalsCount == 0)
        {
            #region AnimalTypes

            AnimalType catType = new AnimalType { Name = "Cat" };
            AnimalType dogType = new AnimalType { Name = "Dog" };
            AnimalType parrotType = new AnimalType { Name = "Parrot" };


            List<AnimalType> animalTypes = new List<AnimalType>
            {
                catType,
                dogType,
                parrotType,
                new AnimalType { Name = "Bird" },
                new AnimalType{ Name = "Livestock" },
                new AnimalType{ Name = "Transportation Animal" },
                new AnimalType{ Name = "Other mammal" }
            };

            context.AnimalTypes.AddRange(animalTypes);

            #endregion

            #region Animals

            Animal dog = new Animal
            {
                Name = "Bobo",
                Age = 13,
                Weight = 5.8m,
                AnimalType = dogType,
                OwnerId = ownerAccount.Id
            };

            Animal cat = new Animal
            {
                Name = "Jusan",
                Age = 2,
                Weight = 3.8m,
                AnimalType = catType,
                OwnerId = ownerAccount.Id
            };

            Animal parrot = new Animal
            {
                Name = "Koko",
                Age = 1,
                Weight = 1.1m,
                AnimalType = parrotType,
                OwnerId = unregiteredOwner.Id
            };

            context.Animals.AddRange(dog, cat, parrot);

            #endregion

            #region Prcedures

            int proceduresCount = await context.Procedures.CountAsync();

            if (proceduresCount == 0)
            {
                Procedure procedure1 = new Procedure
                {
                    StaffId = staff.Id,
                    Name = "Tooth extraction",
                    Description = "Surgical removal of a broken forth upper right Premolar tooth",
                    Date = DateTime.Parse("2024-04-03T13:00"),
                    Animal = dog
                };

                Procedure procedure2 = new Procedure
                {
                    StaffId = staff.Id,
                    Name = "Nail clipping",
                    Description = "Snip only the white part of the claw to prevent nail overgrowth.",
                    Date = DateTime.Parse("2024-06-14T10:25"),
                    Animal = cat
                };

                context.Procedures.AddRange(procedure1, procedure2);
            }

            #endregion

            #region Prescription

            PrescriptionCounter? counter = await context.PrescriptionCounters
                .FirstOrDefaultAsync();

            if (counter is null)
            {
                return;
            }

            Prescription prescription1 = new Prescription
            {
                Number = counter.ShowPrefix ? $"{counter.Prefix}{counter.Separator}{counter.CurrentNumber++:D6}" : $"{counter.CurrentNumber++:D6}",
                IssueDate = DateTime.Parse("2024-07-02"),
                Description = "Generic Anti-parasitic medicine for dogs - Take half a tablet once every week for 4 weeks",
                Animal = dog,
                StaffId = staff.Id,
            };

            Prescription prescription2 = new Prescription
            {
                Number = counter.ShowPrefix ? $"{counter.Prefix}{counter.Separator}{counter.CurrentNumber++:D6}" : $"{counter.CurrentNumber++:D6}",
                IssueDate = DateTime.Parse("2024-07-13"),
                Description = "Generic cat vitamins for cats at age 2 or more - Take one tablet every day for 10 days",
                Animal = cat,
                StaffId = staff.Id,
            };

            context.Prescriptions.AddRange(prescription1, prescription2);

            #endregion
        }

        #region Appointments

        int appointmentsCount = await context.Appointments.CountAsync();

        if (appointmentsCount == 0)
        {
            Appointment appointment1 = new Appointment
            {
                Date = DateTime.Parse("2025-02-12T14:20"),
                Description = "Leukemia vaccination for adult cat",
                StaffId = staff.Id,
                Status = AppointmentStatus.Pending_Review,
                AnimalOwnerId = ownerAccount.Id
            };

            Appointment appointment2 = new Appointment
            {
                Date = DateTime.Parse("2025-02-21T11:00:00"),
                Description = "General checkup on dog",
                StaffId = staff.Id,
                Status = AppointmentStatus.Confirmed,
                AnimalOwnerId = ownerAccount.Id
            };

            context.AddRange(appointment1, appointment2);
        }

        #endregion

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
        string phoneNumber = settings.PhoneNumber;
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

            OwnerAccount account = new OwnerAccount
            {
                Id = Guid.NewGuid().ToString(),
                FirstName = firstName,
                LastName = lastName,
                PhoneNumber = phoneNumber,
                UserId = user.Id
            };

            context.OwnerAccounts.Add(account);
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

                if (string.Equals(role, Role.StaffMember.ToString()))
                {
                    StaffAccount staff = new StaffAccount
                    {
                        Id = Guid.NewGuid().ToString(),
                        AccountId = account.Id,
                    };

                    context.StaffAccounts.Add(staff);

                    await context.SaveChangesAsync();

                    claims.Add(new Claim(InfrastructureConstants.StaffId, staff.Id));
                }

            }

            await userManager.AddClaimsAsync(user, claims);
        }
    }
}