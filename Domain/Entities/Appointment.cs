namespace Entities;

public class Appointment
{
	public int Id { get; set; }

	public DateTime AppointmentDate { get; set; }

	public string AppointmentDesctiption { get; set; } = string.Empty;

	public int AnimalOwnerId { get; set; }

	public AnimalOwner AnimalOwner { get; set; } = null!;

	public bool IsUpcoming { get; set; }

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;
}
