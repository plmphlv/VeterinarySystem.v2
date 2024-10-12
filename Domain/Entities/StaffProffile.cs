using Domain.Common;

namespace Domain.Entities;

public class StaffProffile : AuditableEntity
{
	public int Id { get; set; }

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;

	public ICollection<Procedure> Procedures { get; set; } = new List<Procedure>();

	public ICollection<Appointment> StaffAppointments { get; set; } = new List<Appointment>();

	public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
