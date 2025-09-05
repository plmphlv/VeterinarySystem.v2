using Domain.Common;
using Domain.Enums;

namespace Domain.Entities;

public class Appointment : AuditableEntity
{
	public int Id { get; set; }

	public DateTime Date { get; set; }

	public string? Description { get; set; }

	public AppointmentStatus Status { get; set; }

	public string AnimalOwnerId { get; set; } = null!;

	public OwnerAccount Owner { get; set; } = null!;

	public string? StaffId { get; set; }

	public StaffAccount? StaffAccount { get; set; }
}
