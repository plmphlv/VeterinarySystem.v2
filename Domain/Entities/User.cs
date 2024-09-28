using Microsoft.AspNetCore.Identity;

namespace Entities;

public class User : IdentityUser
{

	public string FirstName { get; set; } = null!;


	public string LastName { get; set; } = null!;

	public bool IsDisabled { get; set; } = false;

	public List<Appointment> Appointments { get; set; } = new List<Appointment>();
	public List<Procedure> Procedures { get; set; } = new List<Procedure>();
}
