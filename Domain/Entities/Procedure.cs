using Domain.Common;

namespace Domain.Entities;

public class Procedure : AuditableEntity
{
	public int Id { get; set; }

	public string Name { get; set; } = null!;

	public string Description { get; set; } = null!;

	public DateTime Date { get; set; }

	public int AnimalId { get; set; }

	public Animal Animal { get; set; } = null!;

	public int StaffMemberId { get; set; }

	public StaffProfile StaffMember { get; set; } = null!;
}
