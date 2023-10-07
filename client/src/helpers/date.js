export function combineDateTime(dateStr, timeStr) {
    const date = new Date(dateStr);
    const [hours, minutes] = timeStr.split(':').map(Number);
    date.setHours(hours);
    date.setMinutes(minutes);
    return date.toISOString();
}
