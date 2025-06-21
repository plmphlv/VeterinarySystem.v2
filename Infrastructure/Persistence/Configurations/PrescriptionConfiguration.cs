using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class PrescriptionConfiguration : AuditableEntityConfiguration<Prescription>
{
    public override void Configure(EntityTypeBuilder<Prescription> builder)
    {
        base.Configure(builder);

        builder.HasKey(p => p.Id);

        builder.Property(p => p.Id)
            .UseIdentityColumn(1, 1);

        builder.Property(p => p.Number)
            .HasMaxLength(8)
            .HasColumnType("varchar(8)")
            .IsRequired();

        builder.HasIndex(p => p.Number)
            .IsUnique();

        builder.HasOne(p => p.Animal)
            .WithMany(a => a.Prescriptions)
            .HasForeignKey(p => p.AnimalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.AnimalId);

        builder.HasOne(p => p.StaffProfile)
            .WithMany(sm => sm.Prescriptions)
            .HasForeignKey(p => p.StaffId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.StaffId);

        builder.Property(p => p.Description)
            .IsRequired()
            .HasMaxLength(1000)
            .HasColumnType("nvarchar(1000)");
    }
}
