export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEK_DAYS = [
  "Sun",
  "Mon",
  "Tue",
  "Wed",
  "Thu",
  "Fri",
  "Sat",
];

export function formatScheduledDate(
  value?: string | null
) {
  if (!value) {
    return "Select date";
  }

  return new Date(
    value
  ).toLocaleDateString([], {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatScheduledTime(
  value?: string | null
) {
  if (!value) {
    return "Select time";
  }

  return new Date(
    value
  ).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function sameDay(
  a: Date,
  b: Date
) {
  return (
    a.getFullYear() ===
      b.getFullYear() &&
    a.getMonth() ===
      b.getMonth() &&
    a.getDate() ===
      b.getDate()
  );
}

export function buildTimeOptions() {
  const options: {
    label: string;
    value: string;
  }[] = [];

  for (
    let hour = 0;
    hour < 24;
    hour++
  ) {
    for (const minute of [
      0,
      30,
    ]) {
      const date =
        new Date();

      date.setHours(
        hour,
        minute,
        0,
        0
      );

      options.push({
        value: `${String(
          hour
        ).padStart(
          2,
          "0"
        )}:${String(
          minute
        ).padStart(
          2,
          "0"
        )}`,

        label:
          date.toLocaleTimeString(
            [],
            {
              hour: "numeric",
              minute: "2-digit",
            }
          ),
      });
    }
  }

  return options;
}

export function buildCalendarDays(
  calendarMonth: Date
) {
  const year =
    calendarMonth.getFullYear();

  const month =
    calendarMonth.getMonth();

  const firstDay =
    new Date(
      year,
      month,
      1
    );

  const startDay =
    firstDay.getDay();

  const daysInMonth =
    new Date(
      year,
      month + 1,
      0
    ).getDate();

  const days: (
    | Date
    | null
  )[] = [];

  for (
    let index = 0;
    index < startDay;
    index++
  ) {
    days.push(null);
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day++
  ) {
    days.push(
      new Date(
        year,
        month,
        day
      )
    );
  }

  return days;
}