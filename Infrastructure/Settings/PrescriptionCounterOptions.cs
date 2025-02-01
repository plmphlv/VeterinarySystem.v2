namespace Infrastructure.Settings;

public class PrescriptionCounterOptions
{
    public int StartingNumber { get; set; }
    public bool ShowPrefix { get; set; }
    public string? Prefix { get; set; }
    public string? Separator { get; set; }
}
