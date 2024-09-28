using Domain.Entities;

namespace Entities;

public class Prescription
{
	public int Id { get; set; }

	public string Number { get; set; } = null!;

	public string? Description { get; set; }

	public DateTime IssueDate { get; set; } = DateTime.Now;

	public int AnimalId { get; set; }

	public Animal Animal { get; set; } = null!;

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;
}
