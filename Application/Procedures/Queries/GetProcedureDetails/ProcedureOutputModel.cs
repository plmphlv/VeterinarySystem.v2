using Application.Procedures.Common;

namespace Application.Procedures.Queries.GetProcedureDetails;

public class ProcedureOutputModel : ProcedureModel
{
    public int Id { get; set; }

    public int AnimalId { get; set; }

    public string AnimalName { get; set; } = null!;

    public int StaffProfileId { get; set; }

    public string StaffMemberName { get; set; } = null!;
}
