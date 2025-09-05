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
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}h`;
};