using Application.Common.Models;

namespace Application.Common.Interfaces
{
    public interface ITemplateRenderer
    {
        string Fill(Template template, IEnumerable<TemplateParameterModel> parameters);
    }
}
