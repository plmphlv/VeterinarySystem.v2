namespace Infrastructure.Settings;

public class AccountSettings
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Password { get; set; } = null!;

    public string Username { get; set; } = null!;

    public string PhoneNumber { get; set; } = null!;

    public string? Role { get; set; } = null!;
}
