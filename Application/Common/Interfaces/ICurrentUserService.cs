﻿namespace Application.Common.Interfaces;

public interface ICurrentUserService
{
    string? UserId { get; }

    string? UserName { get; }

    string? AccountId { get; }

    string? StaffId { get; }
}
