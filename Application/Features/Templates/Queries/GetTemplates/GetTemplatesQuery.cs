using Domain.Enums;

namespace Application.Features.Templates.Queries.GetTemplates
{
    public class GetTemplatesQuery : IRequest<List<TemplateDto>>
    {
        public TemplateType? Type { get; set; }

        public string? Name { get; set; }

        public bool? IsActive { get; set; }
    }

    public class GetTemplatesQueryHandler : IRequestHandler<GetTemplatesQuery, List<TemplateDto>>
    {
        private readonly IApplicationDbContext context;

        public GetTemplatesQueryHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<List<TemplateDto>> Handle(GetTemplatesQuery request, CancellationToken cancellationToken)
        {
            IQueryable<Template> templatesQuery = context.Templates;

            TemplateType? type = request.Type;

            if (type.HasValue)
            {
                templatesQuery = templatesQuery.Where(t => t.Type == type);
            }

            string? name = request.Name;

            if (!string.IsNullOrWhiteSpace(name))
            {
                name = name.ToLower()
                    .Trim();

                templatesQuery = templatesQuery.Where(t => t.Name.ToLower().Contains(name));
            }

            bool? isActive = request.IsActive;

            if (isActive.HasValue)
            {
                templatesQuery = templatesQuery.Where(t => t.IsActive == isActive);
            }

            IQueryable<TemplateDto> joinedQuery =
                from t in templatesQuery
                join createdByUser in context.Users on t.CreatedBy equals createdByUser.Id into createdByGroup
                from createdBy in createdByGroup.DefaultIfEmpty()
                join lastModifiedByUser in context.Users on t.LastModifiedBy equals lastModifiedByUser.Id into lastModifiedByGroup
                from lastModifiedBy in lastModifiedByGroup.DefaultIfEmpty()
                select new TemplateDto
                {
                    Id = t.Id,
                    Name = t.Name,
                    Type = t.Type,
                    IsActive = t.IsActive,
                    CreatedBy = createdBy != null ? createdBy.UserName : null,
                    CreatedDate = t.CreationDate,
                    LastModifiedBy = lastModifiedBy != null ? lastModifiedBy.UserName : null,
                    LastModifiedDate = t.LastModificationDate
                };

            List<TemplateDto> templates = await joinedQuery
                .ToListAsync(cancellationToken);

            return templates;
        }
    }
}
