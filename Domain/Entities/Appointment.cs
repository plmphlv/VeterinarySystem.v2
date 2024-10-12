using Domain.Common;

namespace Domain.Entities;

public class Appointment : AuditableEntity
{
	public int Id { get; set; }

	public DateTime AppointmentDate { get; set; }

	public string AppointmentDesctiption { get; set; } = string.Empty;

	public int AnimalOwnerId { get; set; }

	public User AnimalOwner { get; set; } = null!;

	public bool IsUpcoming { get; set; }

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;
}
