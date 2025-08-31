namespace Application.Appointments.Common;

public abstract class AppointmentModel
{
    public DateTime Date { get; set; }

    public string? Description { get; set; }

    public string StaffId { get; set; } = null!;
}
