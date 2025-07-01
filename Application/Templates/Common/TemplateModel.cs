using Domain.Enums;

namespace Application.Templates.Common
{
    public class TemplateModel
    {
        public string Name { get; set; } = null!;

        public TemplateType Type { get; set; }

        public bool IsActive { get; set; }
    }
}
