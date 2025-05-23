﻿namespace Application.Appointments.Queries.GetAppointmentDetails;

public class AppointmentOutputModel
{
    public int Id { get; set; }

    public string AppointmentStatus { get; set; } = null!;

    public DateTime Date { get; set; }

    public string AnimalOwnerName { get; set; } = null!;

    public string StaffMemberName { get; set; } = null!;

    public string? Desctiption { get; set; }
}
