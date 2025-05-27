using Application.Users.Common;

namespace Application.Users.Commands.UpdateAccount
{
    public class UpdateAccountCommand : AccountModel, IRequest;

    public class UpdateAccountHanlder : IRequestHandler<UpdateAccountCommand>
    {
        private readonly IApplicationDbContext context;

        public UpdateAccountHanlder(IApplicationDbContext context)
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

            account.FirstName = request.FirstName;
            account.LastName = request.LastName;
            account.Address = request.Address;
            account.PhoneNumber = request.PhoneNumber;

            await context.SaveChangesAsync(cancellationToken);
        }
    }
}
