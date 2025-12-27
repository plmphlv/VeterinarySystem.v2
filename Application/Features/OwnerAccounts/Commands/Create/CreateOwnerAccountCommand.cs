using Application.Features.OwnerAccounts.Common;
using Application.Helpers;

namespace Application.Features.OwnerAccounts.Commands.Create;

public class CreateOwnerAccountCommand : OwnerAccountModel, IRequest<string>;

public class CreateOwnerAccountCommandHandler : IRequestHandler<CreateOwnerAccountCommand, string>
{
    private readonly IApplicationDbContext context;

    public CreateOwnerAccountCommandHandler(IApplicationDbContext context)
    {
        this.context = context;
    }

    public async Task<string> Handle(CreateOwnerAccountCommand request, CancellationToken cancellationToken)
    {
        string firstName = request.FirstName.Trim();
        string lastName = request.LastName.Trim();
        string phoneNumber = PhoneNumberFormatter.Standardize(request.PhoneNumber);

        bool ownerExists = await context.OwnerAccounts
            .AnyAsync(ao =>
            ao.FirstName.ToLower() == firstName.ToLower() &&
            ao.LastName.ToLower() == lastName.ToLower() &&
            ao.PhoneNumber == phoneNumber, cancellationToken);

        if (ownerExists)
        {
            List<ValidationFailure> errors = new List<ValidationFailure>
            {
                new ValidationFailure(phoneNumber,"Animal owner already exists!")
            };

            throw new ValidationException(errors);
        }

        OwnerAccount account = new OwnerAccount
        {
            Id = Guid.NewGuid().ToString(),
            FirstName = firstName,
            LastName = lastName,
            PhoneNumber = phoneNumber,
            Address = request.Address
        };

        context.OwnerAccounts.Add(account);
        await context.SaveChangesAsync(cancellationToken);

        return account.Id;
    }
}