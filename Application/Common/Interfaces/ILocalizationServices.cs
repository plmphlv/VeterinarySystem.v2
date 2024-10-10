using System.Globalization;

namespace Application.Common.Interfaces;

public interface ILocalizationServices
{
	DateTimeFormatInfo GetDateTimeFormatInfo();
}
