namespace Application.Prescriptions.Queries.GetPrescription;

public class PrescriptionDto
{
    public int Id { get; set; }

    public string Number { get; set; } = null!;

    public DateTime IssueDate { get; set; }

    public string StaffName { get; set; } = null!;
}
