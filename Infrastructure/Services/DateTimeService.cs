﻿using Common.Interfaces;

namespace Services
{
	public class DateTimeService : IDateTime
	{
		public DateTime Now => DateTime.UtcNow;
	}
}
