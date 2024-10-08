﻿using Domain.Entities;
using Entities;
using Microsoft.EntityFrameworkCore;

namespace Common.Interfaces;

public interface IApplicationDbContext
{
	Task<int> SaveChangesAsync(CancellationToken cancellationToken);

	DbSet<AnimalOwner> AnimalOwners { get; set; }

	DbSet<Animal> Animals { get; set; }

	DbSet<Appointment> Appointments { get; set; }

	DbSet<Procedure> Procedures { get; set; }

	DbSet<Prescription> Prescriptions { get; set; }

	DbSet<AnimalType> AnimalTypes { get; set; }

	DbSet<PrescriptionCounter> PrescriptionCounters { get; set; }
}
