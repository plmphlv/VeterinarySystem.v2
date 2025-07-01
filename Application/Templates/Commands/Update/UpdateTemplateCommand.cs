using Application.Templates.Common;
using Domain.Enums;

namespace Application.Templates.Commands.Update
{
    public class UpdateTemplateCommand : TemplateModel, IRequest
    {
        public int Id { get; set; }

        public string Content { get; set; } = null!;
    }

    public class UpdateTemplateCommandHandler : IRequestHandler<UpdateTemplateCommand>
    {
        private readonly IApplicationDbContext context;

        public UpdateTemplateCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task Handle(UpdateTemplateCommand request, CancellationToken cancellationToken)
        {
            int id = request.Id;

            Template? template = await context.Templates
                .FirstOrDefaultAsync(t => t.Id == id);

            if (template is null)
            {
                throw new NotFoundException(nameof(Template), id);
            }

            bool isActive = request.IsActive;
            TemplateType type = template.Type;

            if (isActive)
            {
                bool isDuplicate = await context.Templates
                    .AnyAsync(t => t.Type == type && t.Id != id, cancellationToken);

                if (isDuplicate)
                {
                    throw new ValidationException(new List<ValidationFailure>()
                    {
                        new ValidationFailure(nameof(Template.Type), $"An active template of type {type} already exists")
                    });
                }
            }

            template.Name = request.Name;
            template.Content = request.Content;
            template.Type = type;
            template.IsActive = isActive;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
