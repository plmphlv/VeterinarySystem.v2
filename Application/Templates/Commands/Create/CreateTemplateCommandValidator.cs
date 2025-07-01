using FluentValidation;

namespace Application.Templates.Commands.Create
{
    public class CreateTemplateCommandValidator : AbstractValidator<CreateTemplateCommand>
    {
        public CreateTemplateCommandValidator()
        {
            RuleFor(c => c.Name)
                .NotEmpty()
                .WithMessage("Name is required");

            RuleFor(c => c.Name)
                .IsInEnum()
                .WithMessage("Unsupported template type");

            RuleFor(c => c.Content)
                .NotEmpty()
                .WithMessage("Content is required");
        }
    }
}
