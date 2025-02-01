namespace Domain.Entities;

public class PrescriptionCounter
{
    public int Id { get; set; }

    public int CurrentNumber { get; set; }

    public bool ShowPrefix { get; set; }

    public string? Prefix { get; set; }

    public string? Separator { get; set; }
}
