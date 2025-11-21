"use client";

import { useState, useEffect } from "react";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  startDate?: Date | null;
  endDate?: Date | null;
}

export default function Calendar({
  selectedDate,
  onDateSelect,
  startDate,
  endDate,
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(
    new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
  );

  useEffect(() => {
    setCurrentMonth(
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    );
  }, [selectedDate]);

  const monthNames = [
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

  const dayNames = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const day = firstDay.getDay();
    return day === 0 ? 6 : day - 1;
  };

  const handlePreviousMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    onDateSelect(newDate);
  };

  const isSelectedDate = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isToday = (day: number) => {
    const today = new Date();
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isInRange = (day: number, monthOffset: number = 0) => {
    if (!startDate || !endDate) return false;

    const checkDate = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      day
    );
    checkDate.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    return checkDate > start && checkDate < end;
  };

  const isStartDateInMonth = (day: number, monthOffset: number = 0) => {
    if (!startDate) return false;
    const checkMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    return (
      startDate.getDate() === day &&
      startDate.getMonth() === checkMonth.getMonth() &&
      startDate.getFullYear() === checkMonth.getFullYear()
    );
  };

  const isEndDateInMonth = (day: number, monthOffset: number = 0) => {
    if (!endDate) return false;
    const checkMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + monthOffset,
      1
    );
    return (
      endDate.getDate() === day &&
      endDate.getMonth() === checkMonth.getMonth() &&
      endDate.getFullYear() === checkMonth.getFullYear()
    );
  };

  const isStartDate = (day: number) => {
    if (!startDate) return false;
    return (
      startDate.getDate() === day &&
      startDate.getMonth() === currentMonth.getMonth() &&
      startDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const isEndDate = (day: number) => {
    if (!endDate) return false;
    return (
      endDate.getDate() === day &&
      endDate.getMonth() === currentMonth.getMonth() &&
      endDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const daysInMonth = getDaysInMonth(currentMonth);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const days: (number | null)[] = [];

  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() - 1,
    0
  );
  const prevMonthDays = prevMonth.getDate();
  const prevMonthDaysToShow: number[] = [];
  for (let i = firstDay - 1; i >= 0; i--) {
    prevMonthDaysToShow.push(prevMonthDays - i);
  }

  const totalCells = 42;
  const nextMonthDaysToShow = totalCells - days.length;
  const nextMonthDays: number[] = [];
  for (let i = 1; i <= nextMonthDaysToShow; i++) {
    nextMonthDays.push(i);
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <button
          onClick={handlePreviousMonth}
          className="text-white/70 hover:text-white active:text-white transition-colors p-2 lg:p-1 touch-manipulation"
          aria-label="Previous month"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-base lg:text-lg font-semibold text-white text-center px-2">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={handleNextMonth}
          className="text-white/70 hover:text-white active:text-white transition-colors p-2 lg:p-1 touch-manipulation"
          aria-label="Next month"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 lg:gap-2 mb-2">
        {dayNames.map((day) => (
          <div
            key={day}
            className="text-center text-xs lg:text-sm font-medium text-white/60 py-1 lg:py-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1 lg:gap-2">
        {prevMonthDaysToShow.map((day) => {
          const inRange = isInRange(day, -1);
          const isStart = isStartDateInMonth(day, -1);
          const isEnd = isEndDateInMonth(day, -1);

          return (
            <div
              key={`prev-${day}`}
              className={`aspect-square flex items-center justify-center text-xs lg:text-sm ${
                isStart || isEnd
                  ? "text-primary"
                  : inRange
                  ? "text-white/50 line-through"
                  : "text-white/30"
              }`}
            >
              {day}
            </div>
          );
        })}

        {days.map((day, index) => {
          if (day === null) return null;
          const selected = isSelectedDate(day);
          const today = isToday(day);
          const inRange = isInRange(day);
          const isStart = isStartDate(day);
          const isEnd = isEndDate(day);

          return (
            <button
              key={index}
              onClick={() => handleDateClick(day)}
              className={`aspect-square flex items-center justify-center text-xs lg:text-sm font-medium rounded-md lg:rounded-lg transition-all touch-manipulation active:scale-95 relative ${
                isStart || isEnd
                  ? "bg-primary text-white"
                  : inRange
                  ? "bg-primary/30 text-white/80 line-through"
                  : selected
                  ? "bg-primary text-white"
                  : today
                  ? "bg-white/10 text-white border-2 border-white/30"
                  : "text-white/80 hover:bg-white/5 active:bg-white/10"
              }`}
            >
              {day}
            </button>
          );
        })}

        {nextMonthDays.map((day) => {
          const inRange = isInRange(day, 1);
          const isStart = isStartDateInMonth(day, 1);
          const isEnd = isEndDateInMonth(day, 1);

          return (
            <div
              key={`next-${day}`}
              className={`aspect-square flex items-center justify-center text-xs lg:text-sm ${
                isStart || isEnd
                  ? "text-primary"
                  : inRange
                  ? "text-white/50 line-through"
                  : "text-white/30"
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>
    </div>
  );
}
