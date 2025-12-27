namespace Application.Features.Appointments.Common;

public abstract class AppointmentModel: AppointmentRequestModel
{
    public string StaffId { get; set; } = null!;
}
