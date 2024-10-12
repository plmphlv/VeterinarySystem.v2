using Application.Common.Interfaces;
using Domain.Entities;
using Entities;
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
	public DbSet<PrescriptionCounter> PrescriptionCounters { get; set; } = null!;

	public override async Task<int> SaveChangesAsync(CancellationToken cancellationToken = new CancellationToken())
	{
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
