namespace Application.AnimalTypes.Commands.Delete;

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

        AnimalType? type = await context.AnimalTypes
            .FirstOrDefaultAsync(at => at.Id == id, cancellationToken);

        if (type is null)
        {
            throw new NotFoundException(nameof(AnimalType), id);
        }

        context.AnimalTypes.Remove(type);

        await context.SaveChangesAsync(cancellationToken);
    }
}