using Application.Animals.Common;
using Application.Common.Exceptions;
using Application.Common.Interfaces;
using Domain.Entities;
using FluentValidation.Results;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Animals.Commands.Create;

public class CreateAnimalCommand : AnimalModel, IRequest<int>
{
	public int AnimalTypeId { get; set; }

	public string AnimalOwnerId { get; set; } = null!;
}

public class CreateAnimalCommandHandler : IRequestHandler<CreateAnimalCommand, int>
{
	private readonly IApplicationDbContext context;

	public CreateAnimalCommandHandler(IApplicationDbContext context)
	{
		this.context = context;
	}

	public async Task<int> Handle(CreateAnimalCommand request, CancellationToken cancellationToken)
	{
		int animalTypeId = request.AnimalTypeId;

		bool animalTypeExists = await context.AnimalTypes
			.AnyAsync(at => at.Id == animalTypeId, cancellationToken);

		if (!animalTypeExists)
		{
			throw new NotFoundException(nameof(AnimalType), animalTypeId);
		}

		string? passportNumber = request.PassportNumber;

		if (!string.IsNullOrWhiteSpace(passportNumber))
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

		if (!string.IsNullOrWhiteSpace(chipNumber))
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

		Animal animals = new Animal
		{
			Name = request.Name,
			Age = request.Age,
			Weight = request.Weight,
			ChipNumber = chipNumber,
			PassportNumber = passportNumber,
			AnimalTypeId = request.AnimalTypeId,
			AnimalOwnerId = request.AnimalOwnerId
		};

		context.Animals.Add(animals);
		await context.SaveChangesAsync(cancellationToken);

		return animals.Id;
	}
}