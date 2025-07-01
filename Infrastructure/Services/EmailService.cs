using Application.Common.Interfaces;
using Infrastructure.Settings;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infrastructure.Services
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings settings;
        public EmailService(IOptions<EmailSettings> settings)
        {
            this.settings = settings.Value;
        }

        public async Task SendEmailAsync(string receiver, string subject, string body)
        {
            MimeMessage email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(settings.Email));
            email.To.Add(MailboxAddress.Parse(receiver));
            email.Subject = subject;
            email.Body = new TextPart("html")
            {
                Text = body
            };

            using SmtpClient client = new SmtpClient();

            await client.ConnectAsync(settings.Host, settings.Port, SecureSocketOptions.StartTls);
            await client.AuthenticateAsync(settings.Email, settings.Password);
            await client.SendAsync(email);
            await client.DisconnectAsync(true);
        }
    }
}