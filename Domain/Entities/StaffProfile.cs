using Domain.Common;

namespace Domain.Entities;

public class StaffProfile : AuditableEntity
{
	public string Id { get; set; } = null!;

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;

	public ICollection<Procedure> Procedures { get; set; } = new List<Procedure>();

	public ICollection<Appointment> StaffAppointments { get; set; } = new List<Appointment>();

	public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
