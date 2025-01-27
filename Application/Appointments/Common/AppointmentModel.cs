namespace Application.Appointments.Common;

public abstract class AppointmentModel
{
    public DateTime Date { get; set; }

    public string? Desctiption { get; set; }

    public int StaffMemberId { get; set; }
}
