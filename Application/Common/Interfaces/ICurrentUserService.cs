namespace Application.Common.Interfaces;

public interface ICurrentUserService
{
	string? UserId { get; }

    public string? UserName { get; }

    string? StaffId { get; }
}
