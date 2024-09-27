export function formatDateWithOrdinal(dateInput: Date | string) {
  const date = new Date(dateInput);
  const day = date.getDate();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const ordinalSuffix = (n: number) => {
    const s = ["th", "st", "nd", "rd"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  if (date) {
    if (date >= today) {
      return "Today";
    } else if (date >= yesterday && date < today) {
      return "Yesterday";
    } else {
      return `${day}${ordinalSuffix(day)} ${month} ${year}`;
    }
  }
}

export function formatDateForMessages(dateInput: Date | string) {
  const date = new Date(dateInput);
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

export function formatTimeToHoursAndMinutes(dateInput: Date | string): string {
  const date = new Date(dateInput);
  return date
    .toLocaleTimeString("default", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    })
    .replace(":", ".");
}
