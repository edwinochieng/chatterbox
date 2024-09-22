export function formatDateWithOrdinal(date: Date): string {
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const ordinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  return `${day}${ordinalSuffix(day)} ${month} ${year}`;
}

export function formatDateForMessages(date: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const timeFormatter = new Intl.DateTimeFormat("default", {
    hour: "2-digit",
    minute: "2-digit",
  });

  if (date) {
    if (date >= today) {
      return timeFormatter.format(date);
    } else if (date >= yesterday && date < today) {
      return "Yesterday";
    } else {
      const day = date.getDate().toString().padStart(2, "0");
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    }
  }
}

export function formatTimeToHoursAndMinutes(date: Date): string {
  return date
    .toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", ".");
}
