using Application.Helpers;
using Application.Users.Common;

namespace Application.Users.Commands.UpdateAccount
{
    public class UpdateAccountCommand : AccountModel, IRequest;

    public class UpdateAccountCommandHanlder : IRequestHandler<UpdateAccountCommand>
    {
        private readonly IApplicationDbContext context;

        public UpdateAccountCommandHanlder(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task Handle(UpdateAccountCommand request, CancellationToken cancellationToken)
        {
            string id = request.Id;

            OwnerAccount? account = await context.OwnerAccounts
                .FirstOrDefaultAsync(oa => oa.Id == id && oa.User != null, cancellationToken);

            if (account is null)
            {
                throw new NotFoundException(nameof(OwnerAccount), id);
            }

            string phoneNumber = PhoneNumberFormatter.Standardize(request.PhoneNumber);

            account.FirstName = request.FirstName;
            account.LastName = request.LastName;
            account.Address = request.Address;
            account.PhoneNumber = phoneNumber;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
