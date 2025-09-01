namespace Application.Users.Common
{
    public class AccountModel
    {
        public string Id { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string? Address { get; set; }

        public string PhoneNumber { get; set; } = null!;
    }
}
