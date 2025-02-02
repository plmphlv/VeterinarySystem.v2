using Application.Common.Interfaces;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Animals.Queries.GetOwnersAnimals;

public class GetOwnersAnimalsQuery : IRequest<List<AnimalDto>>
{
	public string OwnerId { get; set; } = null!;
}

public class GetOwnersAnimalsQueryHandler : IRequestHandler<GetOwnersAnimalsQuery, List<AnimalDto>>
{
	private readonly IApplicationDbContext context;

	public GetOwnersAnimalsQueryHandler(IApplicationDbContext context)
	{
		this.context = context;
	}

	public async Task<List<AnimalDto>> Handle(GetOwnersAnimalsQuery request, CancellationToken cancellationToken)
	{
		List<AnimalDto> animals = await context.Animals
			.Where(a => a.OwnerId == request.OwnerId)
			.Select(a => new AnimalDto
			{
				Id = a.Id,
				Name = a.Name,
				AnimalType = a.AnimalType.Name
			})
			.ToListAsync(cancellationToken);

		return animals;
	}
}