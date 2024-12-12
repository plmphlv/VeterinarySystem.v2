using Application.Animals.Common;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Animals.Commands.Update;

public class UpdateAnimalCommand : AnimalModel, IRequest
{
	public int Id { get; set; }

	public int AnimalTypeId { get; set; }
}

public class UpdateAnimalCommandHandler : IRequestHandler<UpdateAnimalCommand>
{
	private readonly IApplicationDbContext context;

	public UpdateAnimalCommandHandler(IApplicationDbContext context)
	{
		this.context = context;
	}

	public async Task Handle(UpdateAnimalCommand request, CancellationToken cancellationToken)
	{
		int id = request.Id;

		Animal? animal = await context.Animals
			.FirstOrDefaultAsync(a => a.Id == id, cancellationToken);

		if (animal is null)
		{
			throw new NotFoundException(nameof(Animal), id);
		}

		int animalTypeId = request.AnimalTypeId;

		bool animalTypeExists = await context.AnimalTypes
			.AnyAsync(at => at.Id == animalTypeId, cancellationToken);

		if (!animalTypeExists)
		{
			throw new NotFoundException(nameof(AnimalType), animalTypeId);
		}

		string? passportNumber = request.PassportNumber;

		if (!string.IsNullOrWhiteSpace(passportNumber) && !string.Equals(animal.PassportNumber, passportNumber))
		{
			bool passportExists = await context.Animals
				.AnyAsync(a => a.PassportNumber == passportNumber, cancellationToken);

			if (passportExists)
			{
				List<ValidationFailure> errors = new List<ValidationFailure>
				{
					new ValidationFailure(nameof(request.PassportNumber),"Passport has been registred")
				};

				throw new ValidationException(errors);
			}
		}

		string? chipNumber = request.ChipNumber;

		if (!string.IsNullOrWhiteSpace(chipNumber) && !string.Equals(animal.PassportNumber, passportNumber))
		{
			bool chipNumberExists = await context.Animals
				.AnyAsync(a => a.PassportNumber == chipNumber, cancellationToken);

			if (chipNumberExists)
			{
				List<ValidationFailure> errors = new List<ValidationFailure>
				{
					new ValidationFailure(nameof(request.ChipNumber),"Chip number has been registred")
				};

				throw new ValidationException(errors);
			}
		}

		animal.Name = request.Name;
		animal.Weight = request.Weight;
		animal.Age = request.Age;
		animal.PassportNumber = passportNumber;
		animal.ChipNumber = chipNumber;
		animal.AnimalTypeId = animalTypeId;

		await context.SaveChangesAsync(cancellationToken);
	}
}