using Domain.Common;
using Domain.Enums;

namespace Domain.Entities
{
    public class Template : AuditableEntity
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public string Subject { get; set; } = null!;

        public string Content { get; set; } = null!;

        public bool IsActive { get; set; }

        public TemplateType Type { get; set; }
    }
}
