using Application.Common.Interfaces;
using Domain.Common;
using Domain.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System.Reflection;

namespace Infrastructure.Persistence;

public class ApplicationDbContext : IdentityDbContext<User>, IApplicationDbContext
{
    private readonly IDateTime dateTime;
    private readonly ICurrentUserService currentUserService;

    public ApplicationDbContext(
        ICurrentUserService currentUserService,
        IDateTime dateTime,
        DbContextOptions<ApplicationDbContext> options) : base(options)
    {
        this.dateTime = dateTime;
        this.currentUserService = currentUserService;
    }

    public DbSet<Animal> Animals { get; set; } = null!;
    public DbSet<Appointment> Appointments { get; set; } = null!;
    public DbSet<Procedure> Procedures { get; set; } = null!;
    public DbSet<Prescription> Prescriptions { get; set; } = null!;
    public DbSet<AnimalType> AnimalTypes { get; set; } = null!;
    public DbSet<StaffAccount> StaffAccounts { get; set; } = null!;
    public DbSet<OwnerAccount> OwnerAccounts { get; set; } = null!;
    public DbSet<PrescriptionCounter> PrescriptionCounters { get; set; } = null!;

    public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
    {
        foreach (var entry in ChangeTracker.Entries<AuditableEntity>())
        {
            switch (entry.State)
            {
                case EntityState.Added:
                    entry.Entity.CreatedBy = currentUserService.UserId != null ? currentUserService.UserId : "unknown user";
                    entry.Entity.CreationDate = dateTime.Now;
                    break;

                case EntityState.Modified:
                    entry.Entity.LastModifiedBy = currentUserService.UserId != null ? currentUserService.UserId : "unknown user";
                    entry.Entity.LastModificationDate = dateTime.Now;
                    break;

                case EntityState.Deleted:
                    entry.State = EntityState.Modified;
                    entry.Entity.Deleted = true;
                    entry.Entity.DeletedBy = currentUserService.UserId != null ? currentUserService.UserId : "unknown user";
                    entry.Entity.DeletionDate = dateTime.Now;
                    break;
            }
        }

        int result = await base.SaveChangesAsync(cancellationToken);

        return result;
    }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        base.OnConfiguring(optionsBuilder);
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());

        base.OnModelCreating(modelBuilder);
    }
}
