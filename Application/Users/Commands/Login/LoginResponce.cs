namespace Application.Users.Commands.Login;

public class LoginResponce
{
	public string? AccessToken { get; set; }

	public string? RefreshToken { get; set; }

	public bool IsSuccessful { get; set; }

	public string? ErrorMessage { get; set; }
}
