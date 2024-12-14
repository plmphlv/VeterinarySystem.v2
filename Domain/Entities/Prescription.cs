﻿using Domain.Common;

namespace Domain.Entities;

public class Prescription : AuditableEntity
{
	public int Id { get; set; }

	public string Number { get; set; } = null!;

	public string? Description { get; set; }

	public DateTime IssueDate { get; set; } = DateTime.Now;

	public int AnimalId { get; set; }

	public Animal Animal { get; set; } = null!;

    public string StaffMemberId { get; set; } = null!;

    public StaffProfile StaffMember { get; set; } = null!;
}
