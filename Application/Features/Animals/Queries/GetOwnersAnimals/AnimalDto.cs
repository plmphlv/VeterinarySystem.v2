namespace Application.Features.Animals.Queries.GetOwnersAnimals;

public class AnimalDto
{
	public int Id { get; set; }
	public string? Name { get; set; }
	public string AnimalType { get; set; } = null!;
}
