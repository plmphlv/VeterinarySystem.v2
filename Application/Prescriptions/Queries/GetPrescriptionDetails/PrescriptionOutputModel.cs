namespace Application.Prescriptions.Queries.GetPrescriptionDetails;

public class PrescriptionOutputModel
{
    public int Id { get; set; }

    public string Number { get; set; } = null!;

    public DateTime IssueDate { get; set; }

    public string StaffName { get; set; } = null!;

    public string? Description { get; set; }

    public int AnimalId { get; set; }

    public string AnimalName { get; set; } = null!;

    public string OwnerName { get; set; } = null!;
}
