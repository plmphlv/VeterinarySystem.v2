using Application.Features.Templates.Common;
using Domain.Enums;

namespace Application.Features.Templates.Commands.Create
{
    public class CreateTemplateCommand : TemplateModel, IRequest<int>
    {
        public string Content { get; set; } = null!;
    }

    public class CreateTemplateCommandHandler : IRequestHandler<CreateTemplateCommand, int>
    {
        private readonly IApplicationDbContext context;
        public CreateTemplateCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<int> Handle(CreateTemplateCommand request, CancellationToken cancellationToken)
        {
            bool isActive = request.IsActive;
            TemplateType type = request.Type;

            if (isActive)
            {
                bool isDuplicate = await context.Templates
                    .AnyAsync(t => t.Type == type && t.IsActive, cancellationToken);

                if (isDuplicate)
                {
                    throw new ValidationException(new List<ValidationFailure>
                    {
                        new ValidationFailure(nameof(Template.Type), $"An active template of type {type} already exists")
                    });
                }
            }

            Template template = new Template
            {
                Name = request.Name,
                Content = request.Content,
                Type = type,
                IsActive = isActive
            };

            context.Templates.Add(template);

            await context.SaveChangesAsync(cancellationToken);

            return template.Id;
        }
    }
}
