using Microsoft.AspNetCore.Identity;

namespace Domain.Entities;

public class User : IdentityUser
{
	public string FirstName { get; set; } = null!;

	public string LastName { get; set; } = null!;

	public bool IsDisabled { get; set; } = false;

	public string? Address { get; set; }

	public ICollection<Animal> Animals { get; set; } = new List<Animal>();

	public List<Appointment> Appointments { get; set; } = new List<Appointment>();

	public List<Procedure> Procedures { get; set; } = new List<Procedure>();
}
