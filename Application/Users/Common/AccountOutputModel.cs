namespace Application.Users.Common
{
    public class AccountOutputModel
    {
        public string Id { get; set; } = null!;

        public string FirstName { get; set; } = null!;

        public string LastName { get; set; } = null!;

        public string? Address { get; set; }

        public string PhoneNumber { get; set; } = null!;

        public string Email { get; set; } = null!;
    }
}
