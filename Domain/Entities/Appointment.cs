using Domain.Common;

namespace Domain.Entities;

public class Appointment : AuditableEntity
{
	public int Id { get; set; }

	public DateTime Date { get; set; }

	public string? Desctiption { get; set; }

	public bool IsUpcoming { get; set; }

	public string AnimalOwnerId { get; set; } = null!;

	public User AnimalOwner { get; set; } = null!;

    public string StaffMemberId { get; set; } = null!;

    public StaffProfile StaffMember { get; set; } = null!;
}
