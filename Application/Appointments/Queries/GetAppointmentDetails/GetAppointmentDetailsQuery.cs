
namespace Application.Appointments.Queries.GetAppointmentDetails;

public class GetAppointmentDetailsQuery : IRequest<AppointmentOutputModel>
{
    public int Id { get; set; }
}

public class GetAppointmentDetailsQueryHandler : IRequestHandler<GetAppointmentDetailsQuery, AppointmentOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetAppointmentDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<AppointmentOutputModel> Handle(GetAppointmentDetailsQuery request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        AppointmentOutputModel? appointment = await context.Appointments
            .Where(ap => ap.Id == id)
            .Select(ap => new AppointmentOutputModel
            {
                Id = ap.Id,
                AppointmentStatus = ap.Status.ToString(),
                Date = ap.Date,
                AnimalOwnerName = $"{ap.Owner.FirstName} {ap.Owner.LastName}",
                StaffMemberName = $"{ap.StaffAccount.Account.FirstName} {ap.StaffAccount.Account.LastName}",
                Desctiption = ap.Desctiption
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (appointment is null)
        {
            throw new NotFoundException(nameof(Appointment), id);
        }

        return appointment;
    }
}
