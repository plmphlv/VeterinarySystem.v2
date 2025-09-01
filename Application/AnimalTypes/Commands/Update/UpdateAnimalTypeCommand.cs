namespace Application.AnimalTypes.Commands.Update;

public class UpdateAnimalTypeCommand : IRequest
{
    public int Id { get; set; }

    public string TypeName { get; set; } = null!;
}

public class UpdateAnimalTypeCommandHandler : IRequestHandler<UpdateAnimalTypeCommand>
{
    private readonly IApplicationDbContext context;

    public UpdateAnimalTypeCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(UpdateAnimalTypeCommand request, CancellationToken cancellationToken)
    {
        string typeName = request.TypeName.Trim().ToLower();

        bool typeExists = await context.AnimalTypes
            .AnyAsync(t => t.Name.ToLower() == typeName, cancellationToken);

        if (typeExists)
        {
            List<ValidationFailure> errors = new List<ValidationFailure>
            {
                new ValidationFailure(nameof(AnimalType.Name),"This animal type cannot use the name of an existing one")
            };

            throw new ValidationException(errors);
        }

        int id = request.Id;

        AnimalType? type = await context.AnimalTypes
            .FirstOrDefaultAsync(at => at.Id == id, cancellationToken);

        if (type is null)
        {
            throw new NotFoundException(nameof(AnimalType), id);
        }

        type.Name = request.TypeName;

        await context.SaveChangesAsync(cancellationToken);
    }
}