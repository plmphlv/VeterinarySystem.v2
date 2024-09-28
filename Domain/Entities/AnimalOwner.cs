using Domain.Entities;

namespace Entities;

public class AnimalOwner
{
	public int Id { get; set; }

	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public string PhoneNumber { get; set; } = null!;

	public string? Address { get; set; }

	public ICollection<Animal> Animals { get; set; } = new List<Animal>();

	public ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();
}
