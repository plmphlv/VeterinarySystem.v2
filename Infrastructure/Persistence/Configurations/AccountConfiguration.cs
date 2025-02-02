using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class AccountConfiguration : IEntityTypeConfiguration<Account>
{
    public void Configure(EntityTypeBuilder<Account> builder)
    {
        builder.HasKey(a => a.Id);

        builder.Property(a => a.FirstName)
            .IsRequired()
            .HasMaxLength(69);

        builder.Property(a => a.LastName)
            .IsRequired()
            .HasMaxLength(69);

        builder.HasOne(a => a.User)
            .WithOne(u => u.Account)
            .OnDelete(DeleteBehavior.SetNull);
    }
}
