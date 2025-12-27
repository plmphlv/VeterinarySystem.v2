using Application.Features.Animals.Common;

namespace Application.Features.Animals.Commands.Create;

public class CreateAnimalCommand : AnimalModel, IRequest<int>
{
    public int AnimalTypeId { get; set; }

    public string? OwnerId { get; set; }
}

public class CreateAnimalCommandHandler : IRequestHandler<CreateAnimalCommand, int>
{
    private readonly IApplicationDbContext context;
    private readonly ICurrentUserService currentUserService;

    public CreateAnimalCommandHandler(IApplicationDbContext context, ICurrentUserService currentUserService)
    {
        this.context = context;
        this.currentUserService = currentUserService;
    }

    public async Task<int> Handle(CreateAnimalCommand request, CancellationToken cancellationToken)
    {
        string? ownerId = request.OwnerId;
        
        //TO DO: MAKE SURE NOBODY CAN ADD PETS WILLY-NILLY
        if (string.IsNullOrEmpty(ownerId))
        {
            ownerId = currentUserService.AccountId!;
        }

        bool ownerExists = await context.OwnerAccounts
            .AnyAsync(ao => ao.Id == ownerId);

        if (!ownerExists)
        {
            throw new NotFoundException(nameof(OwnerAccount), ownerId);
        }

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
            AnimalTypeId = animalTypeId,
            OwnerId = ownerId
        };

        context.Animals.Add(animals);
        await context.SaveChangesAsync(cancellationToken);

        return animals.Id;
    }
}