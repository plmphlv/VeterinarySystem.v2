using Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations;

public class PrescriptionCounterConfiguration : IEntityTypeConfiguration<PrescriptionCounter>
{
    public void Configure(EntityTypeBuilder<PrescriptionCounter> builder)
    {
        builder.Property(p => p.Id)
            .UseIdentityColumn(1, 1);
    }
}
