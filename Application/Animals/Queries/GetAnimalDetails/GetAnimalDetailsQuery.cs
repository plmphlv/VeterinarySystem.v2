namespace Application.Animals.Queries.GetAnimalDetails;

public class GetAnimalDetailsQuery : IRequest<AnimalOutputModel>
{
    public int Id { get; set; }
}

public class GetAnimalDetailsQueryHandler : IRequestHandler<GetAnimalDetailsQuery, AnimalOutputModel>
{
    private readonly IApplicationDbContext context;

    public GetAnimalDetailsQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<AnimalOutputModel> Handle(GetAnimalDetailsQuery request, CancellationToken cancellationToken)
    {
        int id = request.Id;

        AnimalOutputModel? animal = await context.Animals
            .Where(a => a.Id == id)
            .Select(a => new AnimalOutputModel
            {
                Name = a.Name,
                Age = a.Age,
                Weight = a.Weight,
                PassportNumber = a.PassportNumber,
                ChipNumber = a.ChipNumber,
                AnimalType = a.AnimalType.Name,
                OwnerName = $"{a.Owner.FirstName} {a.Owner.LastName}"
            })
            .FirstOrDefaultAsync(cancellationToken);

        if (animal is null)
        {
            throw new NotFoundException(nameof(Animal), id);
        }

        return animal;
    }
}