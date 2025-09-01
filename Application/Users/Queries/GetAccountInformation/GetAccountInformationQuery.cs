using Application.Users.Queries.GetAccountInformation;

namespace Application.Users.Queries.GetAccountInforamtion
{
    public class GetAccountInformationQuery : IRequest<AccountOutputModel>
    {
        public string Id { get; set; } = null!;
    }

    public class GetAccountInformationQueryHandler : IRequestHandler<GetAccountInformationQuery, AccountOutputModel>
    {
        private readonly IApplicationDbContext context;

        public GetAccountInformationQueryHandler(IApplicationDbContext context)
        {
            this.context = context;
        }

        public async Task<AccountOutputModel> Handle(GetAccountInformationQuery request, CancellationToken cancellationToken)
        {
            string id = request.Id;

            AccountOutputModel? account = await context.OwnerAccounts
                .Where(oa => oa.Id == id && oa.User != null)
                .Select(a => new AccountOutputModel
                {
                    Id = a.Id,
                    FirstName = a.FirstName,
                    LastName = a.LastName,
                    Address = a.Address,
                    PhoneNumber = a.PhoneNumber,
                    Email = a.User!.Email!
                })
                .FirstOrDefaultAsync(cancellationToken);

            if (account is null)
            {
                throw new NotFoundException(nameof(OwnerAccount), id);
            }

            return account;
        }
    }
}
