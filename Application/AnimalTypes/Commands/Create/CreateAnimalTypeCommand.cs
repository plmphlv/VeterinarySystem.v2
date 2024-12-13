using Application.AnimalTypes.Common;

namespace Application.AnimalTypes.Commands.Create;

public class CreateAnimalTypeCommand : AnimalTypeModel, IRequest<int>;

public class CreateAnimalTypeCommandHandler : IRequestHandler<CreateAnimalTypeCommand, int>
{
    private readonly IApplicationDbContext context;

    public CreateAnimalTypeCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<int> Handle(CreateAnimalTypeCommand request, CancellationToken cancellationToken)
    {
        string typeName = request.TypeName.Trim().ToLower();

        //Note: SQL-Server string comaparisons are case-insensitive
        bool typeExists = await context.AnimalTypes
            .AnyAsync(t => t.Name.ToLower() == typeName, cancellationToken);

        if (typeExists)
        {
            List<ValidationFailure> errors = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(AnimalType),"Animal type already exists")
            };

            throw new ValidationException(errors);
        }

        AnimalType animalType = new AnimalType
        {
            Name = typeName
        };

        context.AnimalTypes.Add(animalType);
        await context.SaveChangesAsync(cancellationToken);

        return animalType.Id;
    }
}
