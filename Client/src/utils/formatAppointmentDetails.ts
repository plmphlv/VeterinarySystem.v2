export const formatStatus = (status: string) => {
    switch (status) {
        case "Pending_Review":
            return "Pending review";
        case "Confirmed":
            return "Confirmed";
        case "Completed":
            return "Completed";
        case "Cancelled":
            return "Cancelled";
        case "Missed":
            return "Missed";
        default:
            return status;
    }
};

export const formatDate = (isoDate: string) => {
    const date = new Date(isoDate);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const weekday = weekdays[date.getDay()];

    return `${day}.${month}.${year} (${weekday})`;
};

export const formatTime = (isoDate: string) => {
    const date = new Date(isoDate);
    let hours = date.getHours() + 2;
    const minutes = date.getMinutes().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    const formattedHours = hours.toString().padStart(2, "0");

    return `${formattedHours}:${minutes} ${ampm}`;
};

// UTC (ISO) → datetime-local (local time)
export const isoToDatetimeLocal = (isoString: string): string => {
    const date = new Date(isoString);

    const pad = (n: number) => String(n).padStart(2, "0");

    return (
        date.getFullYear() +
        "-" +
        pad(date.getMonth() + 1) +
        "-" +
        pad(date.getDate()) +
        "T" +
        pad(date.getHours()) +
        ":" +
        pad(date.getMinutes())
    );
};

// datetime-local (local time) → ISO (UTC)
export const datetimeLocalToIso = (localDate: string): string => {
    return new Date(localDate).toISOString();
};
