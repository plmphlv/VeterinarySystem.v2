using Domain.Entities;
using Infrastructure.Persistence.Configurations.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AnimalConfiguration : AuditableEntityConfiguration<Animal>
{
	public override void Configure(EntityTypeBuilder<Animal> builder)
	{
		base.Configure(builder);

		builder.HasKey(a => a.Id);

		builder.Property(a => a.Id)
			.UseIdentityColumn(1, 1);

		builder.Property(a => a.Name)
			.HasMaxLength(60)
			.HasColumnType("nvarchar(60)");

		builder.Property(a => a.Weight)
			.IsRequired();

		builder.Property(a => a.PassportNumber)
			.IsRequired(false)
			.HasMaxLength(15)
			.HasColumnType("varchar(15)");

		builder.HasIndex(a => a.PassportNumber)
			.HasFilter("\"PassportNumber\" IS NOT NULL")
			.IsUnique();

		builder.Property(a => a.ChipNumber)
			.IsRequired(false)
			.HasMaxLength(15)
			.HasColumnType("varchar(15)");

		builder.HasIndex(a => a.ChipNumber)
			.HasFilter("\"ChipNumber\" IS NOT NULL")
			.IsUnique();

		builder.HasOne(a => a.AnimalOwner)
			.WithMany(ao => ao.Animals)
			.HasForeignKey(a => a.AnimalOwnerId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasIndex(a => a.AnimalOwnerId);

		builder.HasOne(a => a.AnimalType)
			.WithMany(at => at.Animals)
			.HasForeignKey(a => a.AnimalTypeId)
			.OnDelete(DeleteBehavior.Cascade);

		builder.HasIndex(a => a.AnimalTypeId);
	}
}
