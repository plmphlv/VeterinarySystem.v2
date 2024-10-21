using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AnimalTypeConfiguration : AuditableEntityConfiguration<AnimalType>
{
	public override void Configure(EntityTypeBuilder<AnimalType> builder)
	{
		base.Configure(builder);

		builder.HasKey(at => at.Id);

		builder.Property(at => at.Id)
			.UseIdentityColumn(1, 1);

		builder.Property(at => at.Name)
			.HasMaxLength(45)
			.HasColumnType("nvarchar(45)")
			.IsRequired();
	}
}
