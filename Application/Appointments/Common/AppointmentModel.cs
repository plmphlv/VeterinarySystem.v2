namespace Application.Appointments.Common;

public abstract class AppointmentModel
{
    public DateTime Date { get; set; }

    public string? Desctiption { get; set; }

    public string StaffId { get; set; } = null!;
}
