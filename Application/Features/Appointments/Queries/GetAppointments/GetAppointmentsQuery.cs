using Domain.Enums;

namespace Application.Features.Appointments.Queries.GetAppointments;

public class GetAppointmentsQuery : IRequest<List<AppointmentDto>>
{
    public string? OwnerId { get; set; }

    public string? StaffId { get; set; }

    public AppointmentStatus? Status { get; set; }

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}

public class GetAppointmentsQueryHandler : IRequestHandler<GetAppointmentsQuery, List<AppointmentDto>>
{
    private readonly IApplicationDbContext context;

    public GetAppointmentsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<List<AppointmentDto>> Handle(GetAppointmentsQuery request, CancellationToken cancellationToken)
    {
        IQueryable<Appointment> appointments = context.Appointments;

        AppointmentStatus? status = request.Status;

        if (status is not null)
        {
            appointments = appointments
                .Where(ap => ap.Status == status);
        }

        DateTime? startDate = request.StartDate;
        DateTime? endDate = request.EndDate;

        if (startDate is not null || endDate is not null)
        {
            if (startDate is not null && endDate is not null)
            {
                appointments = appointments
                    .Where(ap => ap.Date >= startDate && ap.Date <= endDate);
            }
            else if (startDate is not null)
            {
                appointments = appointments
                    .Where(ap => ap.Date >= startDate);
            }
            else if (endDate is not null)
            {
                appointments = appointments
                    .Where(ap => ap.Date <= endDate);
            }
        }

        string? ownerId = request.OwnerId;

        if (!string.IsNullOrEmpty(ownerId))
        {
            appointments = appointments
                .Where(ap => ap.AnimalOwnerId == ownerId);
        }

        string? staffId = request.StaffId;

        if (!string.IsNullOrWhiteSpace(staffId))
        {
            appointments = appointments
                .Where(ap => ap.StaffId == staffId);
        }

        List<AppointmentDto> appointmentDtos = await appointments
            .Select(ap => new AppointmentDto
            {
                Id = ap.Id,
                Status = ap.Status,
                Date = ap.Date,
                StaffMemberName = $"{ap.StaffAccount.Account.FirstName} {ap.StaffAccount.Account.LastName}"
            })
            .ToListAsync(cancellationToken);

        return appointmentDtos;
    }
}
