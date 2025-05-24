using System.Text.RegularExpressions;

namespace Application.Helpers
{
    internal static class PhoneNumberFormatter
    {
        public static string Standardize(string input)
        {
            if (string.IsNullOrWhiteSpace(input))
            {
                return null;
            }

            // Remove all non-digit characters, keep leading + if present
            string cleaned = input.Trim();

            if (cleaned.StartsWith("00"))
            {
                cleaned = string.Concat("+", cleaned.AsSpan(2));
            }

            cleaned = Regex.Replace(cleaned, @"[^\d+]", "");

            // Normalize to start with +359
            if (cleaned.StartsWith("0"))
            {
                cleaned = string.Concat("+359", cleaned.AsSpan(1));
            }
            else if (cleaned.StartsWith("359"))
            {
                cleaned = string.Concat("+359", cleaned.AsSpan(3));
            }

            if (!cleaned.StartsWith("+359"))
            {
                return null; // Not Bulgarian
            }

            // Remaining digits after country code
            string digits = cleaned.Substring(4);

            if (digits.Length != 9)
            {
                return null; // Invalid length
            }

            // Format as: +359 XX XXX XXXX
            string formatted = $"+359 {digits.Substring(0, 2)} {digits.Substring(2, 3)} {digits.Substring(5, 4)}";

            return formatted;
        }
    }
}
