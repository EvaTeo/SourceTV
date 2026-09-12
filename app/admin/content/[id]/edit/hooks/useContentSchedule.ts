"use client";

import {
  useMemo,
  useState,
} from "react";

import {
  buildCalendarDays,
  buildTimeOptions,
} from "../lib/schedule";

type UseContentScheduleInput = {
  scheduledAt?:
    | string
    | null;

  onScheduledAtChange: (
    value: string | null
  ) => void;
};

export default function useContentSchedule({
  scheduledAt,
  onScheduledAtChange,
}: UseContentScheduleInput) {
  const [
    calendarOpen,
    setCalendarOpen,
  ] = useState(false);

  const [
    timeOpen,
    setTimeOpen,
  ] = useState(false);

  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(() =>
    scheduledAt
      ? new Date(scheduledAt)
      : new Date()
  );

  const timeOptions =
    useMemo(
      () =>
        buildTimeOptions(),
      []
    );

  const calendarDays =
    useMemo(
      () =>
        buildCalendarDays(
          calendarMonth
        ),
      [calendarMonth]
    );

  function selectScheduleDate(
    date: Date
  ) {
    const current =
      scheduledAt
        ? new Date(
            scheduledAt
          )
        : new Date();

    current.setFullYear(
      date.getFullYear()
    );

    current.setMonth(
      date.getMonth()
    );

    current.setDate(
      date.getDate()
    );

    if (!scheduledAt) {
      current.setHours(
        19,
        0,
        0,
        0
      );
    }

    onScheduledAtChange(
      current.toISOString()
    );

    setCalendarOpen(
      false
    );
  }

  function selectScheduleTime(
    value: string
  ) {
    const [
      hours,
      minutes,
    ] = value
      .split(":")
      .map(Number);

    const current =
      scheduledAt
        ? new Date(
            scheduledAt
          )
        : new Date();

    current.setHours(
      hours,
      minutes,
      0,
      0
    );

    onScheduledAtChange(
      current.toISOString()
    );

    setTimeOpen(false);
  }

  return {
    calendarOpen,
    timeOpen,
    calendarMonth,
    calendarDays,
    timeOptions,

    setCalendarOpen,
    setTimeOpen,
    setCalendarMonth,

    selectScheduleDate,
    selectScheduleTime,
  };
}