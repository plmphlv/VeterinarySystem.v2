using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class ProcedureConfiguration : AuditableEntityConfiguration<Procedure>
{
	public override void Configure(EntityTypeBuilder<Procedure> builder)
	{
		base.Configure(builder);

		builder.HasKey(p => p.Id);

		builder.Property(p => p.Id)
			.UseIdentityColumn(1, 1);

		builder.Property(p => p.Name)
			.HasMaxLength(90)
			.HasColumnType("nvarchar(90)")
			.IsRequired();

		builder.Property(p => p.Name)
			.HasMaxLength(1000)
			.HasColumnType("nvarchar(1000)")
			.IsRequired();

		builder.Property(p => p.Date)
			.IsRequired();

		builder.HasOne(p => p.Animal)
			.WithMany(a => a.Procedures)
			.HasForeignKey(p => p.AnimalId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasIndex(p => p.AnimalId);

		builder.HasOne(p => p.StaffMember)
			.WithMany(sm => sm.Procedures)
			.HasForeignKey(p => p.StaffMemberId)
			.OnDelete(DeleteBehavior.Restrict);

		builder.HasIndex(p => p.StaffMemberId);
	}
}
