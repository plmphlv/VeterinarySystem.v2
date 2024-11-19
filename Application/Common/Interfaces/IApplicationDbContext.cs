using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace Application.Common.Interfaces;

public interface IApplicationDbContext
{
	Task<int> SaveChangesAsync(CancellationToken cancellationToken);

	DatabaseFacade Database { get; }

	DbSet<Animal> Animals { get; set; }

	DbSet<Appointment> Appointments { get; set; }

	DbSet<Procedure> Procedures { get; set; }

	DbSet<Prescription> Prescriptions { get; set; }

	DbSet<AnimalType> AnimalTypes { get; set; }

	DbSet<PrescriptionCounter> PrescriptionCounters { get; set; }
}
