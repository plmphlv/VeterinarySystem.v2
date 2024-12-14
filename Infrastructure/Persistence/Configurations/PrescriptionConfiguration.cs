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
            .HasMaxLength(6)
            .HasColumnType("varchar(6)")
            .IsRequired();

        builder.HasIndex(p => p.Number)
            .IsUnique();

        builder.HasOne(p => p.Animal)
            .WithMany(a => a.Prescriptions)
            .HasForeignKey(p => p.AnimalId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasIndex(p => p.AnimalId);

        builder.HasOne(p => p.StaffMember)
            .WithMany(sm => sm.Prescriptions)
            .HasForeignKey(p => p.StaffMemberId)
            .OnDelete(DeleteBehavior.SetNull);

        builder.HasIndex(p => p.StaffMemberId);
    }
}
