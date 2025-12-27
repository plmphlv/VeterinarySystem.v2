using Application.Common.Models;

namespace Application.Features.AnimalTypes.Queries.GetAnimalTypesList;

public class GetAnimalTypesListQuery : IRequest<List<DropdownModel>>;

public class GetAnimalTypesListQueryHandler : IRequestHandler<GetAnimalTypesListQuery, List<DropdownModel>>
{
    private readonly IApplicationDbContext context;

    public GetAnimalTypesListQueryHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<List<DropdownModel>> Handle(GetAnimalTypesListQuery request, CancellationToken cancellationToken)
    {
        List<DropdownModel> animalTypes = await context.AnimalTypes
            .Select(at => new DropdownModel
            {
                Id = at.Id,
                Value = at.Name
            })
            .ToListAsync(cancellationToken);

        return animalTypes;
    }
}
