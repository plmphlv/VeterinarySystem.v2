﻿using Domain.Entities;

namespace Entities;

public class Procedure
{
	public int Id { get; set; }

	public string Name { get; set; } = string.Empty;

	public string Description { get; set; } = string.Empty;

	public DateTime Date { get; set; }

	public int AnimalId { get; set; }

	public Animal Animal { get; set; } = null!;

	public string StaffMemberId { get; set; } = null!;

	public User StaffMember { get; set; } = null!;
}
