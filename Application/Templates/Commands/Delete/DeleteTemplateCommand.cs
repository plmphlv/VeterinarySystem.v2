
namespace Application.Templates.Commands.Delete
{
    public class DeleteTemplateCommand : IRequest
    {
        public int Id { get; set; }
    }

    public class DeleteTemplateCommandHandler : IRequestHandler<DeleteTemplateCommand>
    {
        private readonly IApplicationDbContext context;

        public DeleteTemplateCommandHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task Handle(DeleteTemplateCommand request, CancellationToken cancellationToken)
        {
            int id = request.Id;

            Template? template = await context.Templates
                .FirstOrDefaultAsync(t => t.Id == id, cancellationToken);

            if (template is null)
            {
                throw new NotFoundException(nameof(template), id);
            }

            context.Templates.Remove(template);

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
