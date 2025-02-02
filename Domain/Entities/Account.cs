using Domain.Common;

namespace Domain.Entities;

public class Account : AuditableEntity
{
    public string Id { get; set; } = null!;

    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Address { get; set; }

    public string? PhoneNumber { get; set; }

    public StaffAccount? StaffAccount { get; set; } = null;

    public string? UserId { get; set; }

    public User? User { get; set; }

    public ICollection<Animal> Animals { get; set; } = new List<Animal>();

    public ICollection<Appointment> OwnerAppointments { get; set; } = new List<Appointment>();
}
