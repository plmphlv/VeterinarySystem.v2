namespace Application.Features.Animals.Common;

public abstract class AnimalModel
{
	public string? Name { get; set; }

	public int? Age { get; set; }

	public decimal Weight { get; set; }

	public string? PassportNumber { get; set; }

	public string? ChipNumber { get; set; }
}
