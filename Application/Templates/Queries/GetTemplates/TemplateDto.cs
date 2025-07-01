using Application.Templates.Common;

namespace Application.Templates.Queries.GetTemplates
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
