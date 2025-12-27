namespace Application.Features.Users.Commands.Login;

public class AuthResponse
{
	public string? AccessToken { get; set; }

	public string? RefreshToken { get; set; }

	public bool IsSuccessful { get; set; }

	public string? ErrorMessage { get; set; }
}
