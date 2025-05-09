﻿using Domain.Common;

namespace Domain.Entities;

public class Procedure : AuditableEntity
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime Date { get; set; }

    public int AnimalId { get; set; }

    public Animal Animal { get; set; } = null!;

    public string StaffId { get; set; } = null!;

    public StaffAccount StaffProfile { get; set; } = null!;
}
