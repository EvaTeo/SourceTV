import {
  MONTH_NAMES,
  WEEK_DAYS,
  formatScheduledDate,
  formatScheduledTime,
  sameDay,
} from "../lib/schedule";

type TimeOption = {
  label: string;
  value: string;
};

type SchedulePickerProps = {
  scheduledAt?:
    | string
    | null;

  calendarOpen: boolean;
  timeOpen: boolean;

  calendarMonth: Date;

  calendarDays: (
    | Date
    | null
  )[];

  timeOptions: TimeOption[];

  setCalendarOpen: (
    value: boolean
  ) => void;

  setTimeOpen: (
    value: boolean
  ) => void;

  setCalendarMonth: (
    value: Date
  ) => void;

  onSelectDate: (
    date: Date
  ) => void;

  onSelectTime: (
    value: string
  ) => void;

  onClear: () => void;
};

export default function SchedulePicker({
  scheduledAt,

  calendarOpen,
  timeOpen,

  calendarMonth,
  calendarDays,
  timeOptions,

  setCalendarOpen,
  setTimeOpen,
  setCalendarMonth,

  onSelectDate,
  onSelectTime,
  onClear,
}: SchedulePickerProps) {
  const selectedDate =
    scheduledAt
      ? new Date(scheduledAt)
      : null;

  return (
    <div className="md:col-span-2">
      <label className="block text-sm font-bold text-white/60">
        Scheduled Release
      </label>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setCalendarOpen(
                !calendarOpen
              );

              setTimeOpen(false);
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3 text-left text-sm text-white/70 transition hover:border-white/20"
          >
            <span>
              {formatScheduledDate(
                scheduledAt
              )}
            </span>

            <span className="text-white/30">
              ▾
            </span>
          </button>

          {calendarOpen && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-50 w-full min-w-[320px] rounded-2xl border border-white/10 bg-[#090c12] p-4 shadow-2xl">
              <div className="flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() -
                          1,
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-white/10 px-3 py-2 text-white/50 transition hover:text-white"
                >
                  ←
                </button>

                <p className="font-bold text-white">
                  {
                    MONTH_NAMES[
                      calendarMonth.getMonth()
                    ]
                  }{" "}
                  {
                    calendarMonth.getFullYear()
                  }
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setCalendarMonth(
                      new Date(
                        calendarMonth.getFullYear(),
                        calendarMonth.getMonth() +
                          1,
                        1
                      )
                    )
                  }
                  className="rounded-lg border border-white/10 px-3 py-2 text-white/50 transition hover:text-white"
                >
                  →
                </button>
              </div>

              <div className="mt-4 grid grid-cols-7 gap-1 text-center">
                {WEEK_DAYS.map(
                  (day) => (
                    <div
                      key={day}
                      className="py-2 text-[10px] font-black uppercase tracking-[0.12em] text-white/25"
                    >
                      {day}
                    </div>
                  )
                )}

                {calendarDays.map(
                  (
                    day,
                    index
                  ) => {
                    const selected =
                      day &&
                      selectedDate
                        ? sameDay(
                            day,
                            selectedDate
                          )
                        : false;

                    return day ? (
                      <button
                        key={day.toISOString()}
                        type="button"
                        onClick={() =>
                          onSelectDate(
                            day
                          )
                        }
                        className={`rounded-lg py-2 text-xs font-semibold transition ${
                          selected
                            ? "bg-sky-300 text-black"
                            : "text-white/55 hover:bg-white/[0.06] hover:text-white"
                        }`}
                      >
                        {day.getDate()}
                      </button>
                    ) : (
                      <div
                        key={`empty-${index}`}
                      />
                    );
                  }
                )}
              </div>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => {
              setTimeOpen(
                !timeOpen
              );

              setCalendarOpen(
                false
              );
            }}
            className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-black px-4 py-3 text-left text-sm text-white/70 transition hover:border-white/20"
          >
            <span>
              {formatScheduledTime(
                scheduledAt
              )}
            </span>

            <span className="text-white/30">
              ▾
            </span>
          </button>

          {timeOpen && (
            <div className="absolute left-0 top-[calc(100%+10px)] z-50 max-h-64 w-full overflow-auto rounded-2xl border border-white/10 bg-[#090c12] p-2 shadow-2xl">
              {timeOptions.map(
                (option) => (
                  <button
                    key={
                      option.value
                    }
                    type="button"
                    onClick={() =>
                      onSelectTime(
                        option.value
                      )
                    }
                    className="block w-full rounded-xl px-3 py-2.5 text-left text-sm text-white/55 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    {option.label}
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {scheduledAt && (
        <button
          type="button"
          onClick={onClear}
          className="mt-3 text-xs font-bold text-red-200/60 transition hover:text-red-200"
        >
          Clear schedule
        </button>
      )}
    </div>
  );
}