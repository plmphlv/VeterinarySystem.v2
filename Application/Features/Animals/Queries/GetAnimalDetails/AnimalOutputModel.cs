using Application.Features.Animals.Common;

namespace Application.Features.Animals.Queries.GetAnimalDetails;

public class AnimalOutputModel : AnimalModel
{
	public string OwnerName { get; set; } = null!;

	public string AnimalType { get; set; } = null!;
}
