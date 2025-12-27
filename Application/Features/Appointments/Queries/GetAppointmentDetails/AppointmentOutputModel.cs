namespace Application.Features.Appointments.Queries.GetAppointmentDetails;

public class AppointmentOutputModel
{
    public int Id { get; set; }

    public string AppointmentStatus { get; set; } = null!;

    public DateTime Date { get; set; }

    public string AnimalOwnerName { get; set; } = null!;

    public string? StaffMemberId { get; set; }

    public string StaffMemberName { get; set; } = null!;

    public string? Description { get; set; }
}
