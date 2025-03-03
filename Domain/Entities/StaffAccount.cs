using Domain.Common;

namespace Domain.Entities;

public class StaffAccount : AuditableEntity
{
    public string Id { get; set; } = null!;

    public string AccountId { get; set; } = null!;

    public OwnerAccount Account { get; set; } = null!;

    public ICollection<Procedure> Procedures { get; set; } = new List<Procedure>();

    public ICollection<Appointment> StaffAppointments { get; set; } = new List<Appointment>();

    public ICollection<Prescription> Prescriptions { get; set; } = new List<Prescription>();
}
