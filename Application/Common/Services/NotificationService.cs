using Application.Common.Models;
using Domain.Enums;

namespace Application.Common.Services
{
    public class NotificationService : INotificationService
    {
        private readonly IEmailService emailService;
        private readonly ITemplateRenderer templateRenderer;
        private readonly IApplicationDbContext context;

        public NotificationService(IEmailService emailService, ITemplateRenderer templateRenderer, IApplicationDbContext context)
        {
            this.emailService = emailService;
            this.templateRenderer = templateRenderer;
            this.context = context;
        }

        public async Task SendEmailNotificationAsync(string recipient, string subject, string body)
        {
            await emailService.SendEmailAsync(recipient, subject, body);
        }

        public async Task SendEmailNotificationAsync(string recipient, string subject, TemplateType templateType, IEnumerable<TemplateParameterModel> parameters)
        {
            Template? template = await context.Templates.FirstOrDefaultAsync(t => t.IsActive && t.Type == templateType);

            if (template is null)
            {
                throw new NotFoundException(nameof(Template), templateType);
            }

            string body = templateRenderer.Fill(template, parameters);

            await emailService.SendEmailAsync(recipient, recipient, body);
        }

        public async Task SendEmailNotificationAsync(string recipient, string subject, Template template, IEnumerable<TemplateParameterModel> parameters)
        {
            string body = templateRenderer.Fill(template, parameters);

            await emailService.SendEmailAsync(recipient, recipient, body);
        }
    }
}
