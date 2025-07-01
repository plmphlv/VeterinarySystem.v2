using FluentValidation;

namespace Application.Templates.Commands.Update
{
    public class UpdateTemplateCommandValidator : AbstractValidator<UpdateTemplateCommand>
    {
        public UpdateTemplateCommandValidator()
        {
            RuleFor(c => c.Id)
                .GreaterThan(0)
                .WithMessage("Invalid id");

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
