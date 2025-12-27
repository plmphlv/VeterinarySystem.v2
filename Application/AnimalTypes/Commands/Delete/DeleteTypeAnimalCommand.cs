namespace Application.AnimalTypes.Commands.Delete;

public class DeleteTypeAnimalCommand : IRequest
{
    public int Id { get; set; }
}

public class DeleteTypeAnimalCommandHandler : IRequestHandler<DeleteTypeAnimalCommand>
{
    private readonly IApplicationDbContext context;

    public DeleteTypeAnimalCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task Handle(DeleteTypeAnimalCommand request, CancellationToken cancellationToken)
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