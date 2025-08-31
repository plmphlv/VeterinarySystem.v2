using Domain.Common;

namespace Domain.Entities;

public class AnimalType : AuditableEntity
{
	public int Id { get; set; }

	public string Name { get; set; } = null!;

	public ICollection<Animal> Animals { get; set; } = new List<Animal>();
}
