namespace Application.OwnerAccounts.Common;

public abstract class OwnerAccountModel
{
    public string FirstName { get; set; } = null!;

    public string LastName { get; set; } = null!;

    public string? Address { get; set; }

    public string PhoneNumber { get; set; } = null!;
}
