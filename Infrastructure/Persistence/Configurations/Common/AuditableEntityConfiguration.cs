using Domain.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Infrastructure.Persistence.Configurations.Common;

public class AuditableEntityConfiguration<T> : IEntityTypeConfiguration<T> where T : AuditableEntity
{
	public virtual void Configure(EntityTypeBuilder<T> builder)
	{
		builder.HasQueryFilter(ae => !ae.Deleted);

		builder.Property(ae => ae.CreatedBy)
			.IsRequired();
	}
}
