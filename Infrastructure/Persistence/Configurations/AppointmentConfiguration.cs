using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations
{
    public class AppointmentConfiguration : AuditableEntityConfiguration<Appointment>
    {
        public override void Configure(EntityTypeBuilder<Appointment> builder)
        {
            base.Configure(builder);

            builder.HasKey(a => a.Id);

            builder.Property(a => a.Id)
                .UseIdentityColumn(1, 1);

            builder.Property(a => a.Date)
                .IsRequired();

            builder.Property(a => a.Status)
                .IsRequired()
                .HasConversion<string>();

            builder.Property(p => p.Desctiption)
                .HasMaxLength(255)
                .HasColumnType("nvarchar(255)")
                .IsRequired(false);

            builder.HasOne(a => a.AnimalOwner)
                .WithMany(ao => ao.OwnerAppointments)
                .HasForeignKey(a => a.AnimalOwnerId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(a => a.AnimalOwnerId);

            builder.HasOne(a => a.StaffMember)
                .WithMany(sm => sm.StaffAppointments)
                .HasForeignKey(a => a.StaffMemberId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(a => a.StaffMemberId);
        }
    }
}
