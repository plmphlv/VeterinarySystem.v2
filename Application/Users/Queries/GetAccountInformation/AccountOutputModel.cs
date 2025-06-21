using Application.Users.Common;

namespace Application.Users.Queries.GetAccountInformation
{
    public class AccountOutputModel: AccountModel
    {
        public string Email { get; set; } = null!;
    }
}
