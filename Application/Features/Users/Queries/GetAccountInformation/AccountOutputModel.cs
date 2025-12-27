using Application.Features.Users.Common;

namespace Application.Features.Users.Queries.GetAccountInformation
{
    public class AccountOutputModel: AccountModel
    {
        public string Email { get; set; } = null!;
    }
}
