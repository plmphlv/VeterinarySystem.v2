namespace Application.Appointments.Queries.GetAppointmentDetails;

public class GetAppointmentDetailsQuery : IRequest<AppointmentOutputModel>
{
    public int Id { get; set; }
}

public class GetAppointmentDetailsQueryHandler : IRequestHandler<GetAppointmentDetailsQuery, AppointmentOutputModel>
{
    private readonly IApplicationDbContext context;

    private readonly ICurrentUserService currentUserService;

    public GetAppointmentDetailsQueryHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        this.context = context;
        this.currentUserService = currentUserService;
    }

    public async Task<AppointmentOutputModel> Handle(GetAppointmentDetailsQuery request, CancellationToken cancellationToken)
    {
        string? staffId = currentUserService.StaffId;

        bool staffExists = await context.StaffAccounts
            .AnyAsync(sm => sm.Id == staffId, cancellationToken);

        int id = request.Id;

        AppointmentOutputModel? appointment = await context.Appointments
            .Where(ap => ap.Id == id)
            .Select(ap => new AppointmentOutputModel
            {
                Id = ap.Id,
                AppointmentStatus = ap.Status.ToString(),
                Date = ap.Date,
                AnimalOwnerName = $"{ap.Owner.FirstName} {ap.Owner.LastName}",
                StaffMemberId = staffExists ? ap.StaffId : null,
                StaffMemberName = ap.StaffAccount != null ? $"{ap.StaffAccount.Account.FirstName} {ap.StaffAccount.Account.LastName}" : "Staff memder has not been assigned",
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
