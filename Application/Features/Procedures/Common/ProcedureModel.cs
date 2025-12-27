namespace Application.Features.Procedures.Common;

public abstract class ProcedureModel
{
    public string Name { get; set; } = null!;

    public string Description { get; set; } = null!;

    public DateTime Date { get; set; }
}
