using Domain.Enums;

namespace Application.Appointments.Queries.GetAppointments
{
    public class AppointmentDto
    {
        public int Id { get; set; }

        public AppointmentStatus Status { get; set; }

        public DateTime Date { get; set; }

        public string StaffMemberName { get; set; } = null!;
    }
}