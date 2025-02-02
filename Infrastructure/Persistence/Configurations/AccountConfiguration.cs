using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<OwnerAccount>
{
    public void Configure(EntityTypeBuilder<OwnerAccount> builder)
    {
        builder.HasKey(oc => oc.Id);

        builder.Property(oc => oc.FirstName)
            .IsRequired()
            .HasMaxLength(69);

        builder.Property(oc => oc.LastName)
            .IsRequired()
            .HasMaxLength(69);

        builder.Property(oc => oc.PhoneNumber)
            .IsRequired()
            .HasMaxLength(16)
            .HasColumnType("varchar(16)");

        builder.Property(oc => oc.Address)
            .IsRequired(false)
            .HasMaxLength(69)
            .HasColumnType("nvarchar(69)");

        builder.HasOne(oc => oc.User)
            .WithOne(u => u.Account)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
