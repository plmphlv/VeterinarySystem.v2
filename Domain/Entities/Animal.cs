using Domain.Common;

namespace Domain.Entities;

public class Animal : AuditableEntity
{
	public int Id { get; set; }

	public string? Name { get; set; }

	public int? Age { get; set; }

	public decimal Weight { get; set; }

	public string? PassportNumber { get; set; }

	public string? ChipNumber { get; set; }

	public int AnimalTypeId { get; set; }

	public AnimalType AnimalType { get; set; } = null!;

	public string AnimalOwnerId { get; set; } = null!;

	public User AnimalOwner { get; set; } = null!;

	public ICollection<Procedure> Procedures { get; set; } = new List<Procedure>();

	public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}

