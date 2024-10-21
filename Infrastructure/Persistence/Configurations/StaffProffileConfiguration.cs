using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class StaffProffileConfiguration : AuditableEntityConfiguration<StaffProffile>
{
	public override void Configure(EntityTypeBuilder<StaffProffile> builder)
	{
		base.Configure(builder);

		builder.HasKey(sp => sp.Id);

		builder.Property(sp => sp.Id)
			.UseIdentityColumn(1, 1);

		builder.HasOne(sp => sp.StaffMember)
			.WithOne(sm => sm.StaffProfile)
			.HasForeignKey<StaffProffile>(sp => sp.StaffMemberId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired();

		builder.HasIndex(sp => sp.StaffMemberId);
			//.HasFilter("\"StaffMemberId\" IS NOT NULL"); 
	}
}
