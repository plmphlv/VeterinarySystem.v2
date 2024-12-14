using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class StaffProffileConfiguration : AuditableEntityConfiguration<StaffProfile>
{
	public override void Configure(EntityTypeBuilder<StaffProfile> builder)
	{
		base.Configure(builder);

		builder.HasKey(sp => sp.Id);

		builder.HasOne(sp => sp.StaffMember)
			.WithOne(sm => sm.StaffProfile)
			.HasForeignKey<StaffProfile>(sp => sp.StaffMemberId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired();

		builder.HasIndex(sp => sp.StaffMemberId);
	}
}
