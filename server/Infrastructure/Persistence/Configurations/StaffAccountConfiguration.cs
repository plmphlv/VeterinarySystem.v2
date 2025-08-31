using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class StaffAccountConfiguration : AuditableEntityConfiguration<StaffAccount>
{
	public override void Configure(EntityTypeBuilder<StaffAccount> builder)
	{
		base.Configure(builder);

		builder.HasKey(sp => sp.Id);

		builder.HasOne(sp => sp.Account)
			.WithOne(sm => sm.StaffAccount)
			.HasForeignKey<StaffAccount>(sp => sp.AccountId)
			.OnDelete(DeleteBehavior.Cascade)
			.IsRequired();

		builder.HasIndex(sp => sp.AccountId);
			//.HasFilter("\"StaffMemberId\" IS NOT NULL"); 
	}
}
