using Application.Features.Templates.Common;

namespace Application.Features.Templates.Queries.GetTemplateDetails
{
    public class TemplateOutputModel : TemplateModel
    {
        public int Id { get; set; }

        public string Content { get; set; } = null!;
    }
}
