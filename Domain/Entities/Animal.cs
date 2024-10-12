using Domain.Common;
using Entities;

namespace Domain.Entities;

public class Animal : AuditableEntity
{
	public int Id { get; set; }

	public string Name { get; set; } = string.Empty;

	public int Age { get; set; }

	public double Weight { get; set; }

	public int AnimalTypeId { get; set; }

	public AnimalType AnimalType { get; set; } = null!;

	public int AnimalOwnerId { get; set; }

	public User AnimalOwner { get; set; } = null!;

	public ICollection<Procedure> Procedures { get; set; } = new List<Procedure>();

	public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}

