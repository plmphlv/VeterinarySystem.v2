using Application.Common.Models;
using System.Text;

namespace Application.Common.Services
{
    public class TemplateRenderer : ITemplateRenderer
    {
        public string Fill(Template template, IEnumerable<TemplateParameterModel> parameters)
        {
            string content = template.Content;

            StringBuilder builder = new StringBuilder(content);

            foreach (TemplateParameterModel parameter in parameters)
            {
                string name = parameter.Name;
                string value = parameter.Value;

                builder.Replace($"{{{{{name}}}}}", value);
            }

            return builder.ToString();
        }
    }
}
