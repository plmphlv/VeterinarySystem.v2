using Application.Common.Models;
using Domain.Enums;

namespace Application.Common.Interfaces
{
    public interface INotificationService
    {
        Task SendEmailNotificationAsync(string recipient, string subject, string body);

        Task SendEmailNotificationAsync(string recipient, string subject, TemplateType templateType, IEnumerable<TemplateParameterModel> parameters);

        Task SendEmailNotificationAsync(string recipient, string subject, Template template, IEnumerable<TemplateParameterModel> parameters);
    }
}