using Domain.Common;

namespace Domain.Entities;

public class Prescription : AuditableEntity
{
    public int Id { get; set; }

    public string Number { get; set; } = null!;

    public string? Description { get; set; }

    public DateTime IssueDate { get; set; }

    public int AnimalId { get; set; }

    public Animal Animal { get; set; } = null!;

    public string StaffId { get; set; } = null!;

    public StaffAccount StaffProfile { get; set; } = null!;
}
