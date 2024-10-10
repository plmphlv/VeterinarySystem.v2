using Application.Common.Interfaces;
using System.Globalization;

namespace Services;

public class LocalizationServices : ILocalizationServices
{
	public DateTimeFormatInfo GetDateTimeFormatInfo()
	{
		DateTimeFormatInfo dateTimeFormatInfo = new CultureInfo("en-EN", false).DateTimeFormat;
		dateTimeFormatInfo.DateSeparator = ".";
		return dateTimeFormatInfo;
	}
}
