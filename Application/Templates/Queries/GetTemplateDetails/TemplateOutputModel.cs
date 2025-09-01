using Application.Templates.Common;

namespace Application.Templates.Queries.GetTemplateDetails
{
    public class TemplateOutputModel : TemplateModel
    {
        public int Id { get; set; }

        public string Content { get; set; } = null!;
    }
}
