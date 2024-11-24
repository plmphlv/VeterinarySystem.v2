using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Animals.Commands.Delete;

public class DeleteAnimalCommand : IRequest
{
	public int Id { get; set; }
}

public class DeleteAnimalCommandHandler : IRequestHandler<DeleteAnimalCommand>
{
	private readonly IApplicationDbContext context;

	public DeleteAnimalCommandHandler(IApplicationDbContext context)
	{
		this.context = context;
	}

	public async Task Handle(DeleteAnimalCommand request, CancellationToken cancellationToken)
	{
		int id = request.Id;

		Animal? animal = await context.Animals
			.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

		if (animal is null)
		{
			throw new NotFoundException(nameof(Animal), id);
		}

		context.Animals.Remove(animal);
		await context.SaveChangesAsync(cancellationToken);
	}
}