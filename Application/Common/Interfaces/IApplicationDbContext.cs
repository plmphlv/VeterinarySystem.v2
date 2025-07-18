﻿using Microsoft.EntityFrameworkCore.Infrastructure;

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

    DbSet<StaffAccount> StaffAccounts { get; set; }

    DbSet<OwnerAccount> OwnerAccounts { get; set; }

    DbSet<User> Users { get; set; }

    DbSet<Template> Templates { get; set; }
}
