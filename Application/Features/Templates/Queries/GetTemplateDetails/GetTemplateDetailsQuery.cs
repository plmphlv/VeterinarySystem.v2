namespace Application.Features.Templates.Queries.GetTemplateDetails
{
    public class GetTemplateDetailsQuery : IRequest<TemplateOutputModel>
    {
        public int Id { get; set; }
    }


    public class GetTemplateDetailsQueryHandler : IRequestHandler<GetTemplateDetailsQuery, TemplateOutputModel>
    {
        private readonly IApplicationDbContext context;

        public GetTemplateDetailsQueryHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<TemplateOutputModel> Handle(GetTemplateDetailsQuery request, CancellationToken cancellationToken)
        {
            int id = request.Id;

            TemplateOutputModel? model = await context.Templates
                .Where(t => t.Id == id)
                .Select(t => new TemplateOutputModel
                {
                    Id = id,
                    Name = t.Name,
                    Content = t.Content,
                    Type = t.Type,
                    IsActive = t.IsActive
                })
                .FirstOrDefaultAsync(cancellationToken);


            if (model is null)
            {
                throw new NotFoundException(nameof(model), id);
            }


            return model;
        }
    }
}
