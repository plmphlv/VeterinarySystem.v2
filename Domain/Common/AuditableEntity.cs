﻿namespace Domain.Common;

public abstract class AuditableEntity
{
	public string CreatedBy { get; set; } = null!;

	public DateTime CreationDate { get; set; }

	public string? LastModifiedBy { get; set; }

	public DateTime? LastModificationDate { get; set; }

	public bool Deleted { get; set; }

	public string? DeletedBy { get; set; }

	public DateTime? DeletionDate { get; set; }
}
