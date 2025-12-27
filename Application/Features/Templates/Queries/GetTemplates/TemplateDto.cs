using Application.Features.Templates.Common;

namespace Application.Features.Templates.Queries.GetTemplates
{
    public class TemplateDto : TemplateModel
    {
        public int Id { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime? LastModifiedDate { get; set; }

        public string CreatedBy { get; set; } = null!;

        public string? LastModifiedBy { get; set; }
    }
}
