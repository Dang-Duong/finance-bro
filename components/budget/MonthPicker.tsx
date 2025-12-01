"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";

interface MonthPickerProps {
  value: string | null; // Format: "YYYY-MM" or null
  onChange: (month: string | null) => void;
  placeholder?: string;
}

export default function MonthPicker({
  value,
  onChange,
  placeholder = "Select month",
}: MonthPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedDate = value ? new Date(value + "-01") : new Date();

  const formatMonth = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const handleMonthSelect = (year: number, month: number) => {
    const monthString = `${year}-${String(month + 1).padStart(2, "0")}`;
    onChange(monthString);
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 rounded-md bg-[#0F1C2E] border border-gray-700 px-3 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition-all flex items-center justify-between min-w-[180px] hover:border-gray-600"
      >
        <span className={value ? "text-white" : "text-gray-400"}>
          {value ? formatMonth(selectedDate) : placeholder}
        </span>
        {value && (
          <button
            type="button"
            onClick={handleClear}
            className="ml-2 text-gray-400 hover:text-gray-200 transition-colors"
            aria-label="Clear month"
          >
            ×
          </button>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden"
              onClick={() => setIsOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#1a2b3d] rounded-lg shadow-2xl border border-white/10 p-4 max-h-[90vh] w-full max-w-[320px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <MonthCalendar
                  selectedDate={selectedDate}
                  onMonthSelect={handleMonthSelect}
                />
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block absolute top-full left-0 mt-2 z-50 bg-[#1a2b3d] rounded-lg shadow-2xl border border-white/10 p-6 w-[320px]"
              onClick={(e) => e.stopPropagation()}
            >
              <MonthCalendar
                selectedDate={selectedDate}
                onMonthSelect={handleMonthSelect}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

interface MonthCalendarProps {
  selectedDate: Date;
  onMonthSelect: (year: number, month: number) => void;
}

function MonthCalendar({ selectedDate, onMonthSelect }: MonthCalendarProps) {
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());

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

  const handlePreviousYear = () => {
    setCurrentYear(currentYear - 1);
  };

  const handleNextYear = () => {
    setCurrentYear(currentYear + 1);
  };

  const isSelectedMonth = (month: number) => {
    return (
      selectedDate.getMonth() === month &&
      selectedDate.getFullYear() === currentYear
    );
  };

  const isCurrentMonth = (month: number) => {
    const today = new Date();
    return today.getMonth() === month && today.getFullYear() === currentYear;
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <button
          onClick={handlePreviousYear}
          className="text-white/70 hover:text-white active:text-white transition-colors p-2 lg:p-1 touch-manipulation"
          aria-label="Previous year"
        >
          <ChevronLeftIcon className="w-5 h-5" />
        </button>
        <h3 className="text-base lg:text-lg font-semibold text-white text-center px-2">
          {currentYear}
        </h3>
        <button
          onClick={handleNextYear}
          className="text-white/70 hover:text-white active:text-white transition-colors p-2 lg:p-1 touch-manipulation"
          aria-label="Next year"
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {monthNames.map((monthName, index) => {
          const selected = isSelectedMonth(index);
          const isCurrent = isCurrentMonth(index);

          return (
            <button
              key={index}
              onClick={() => onMonthSelect(currentYear, index)}
              className={`px-3 py-2 text-sm font-medium rounded-md lg:rounded-lg transition-all touch-manipulation active:scale-95 ${
                selected
                  ? "bg-primary text-white"
                  : isCurrent
                  ? "bg-white/10 text-white border-2 border-white/30"
                  : "text-white/80 hover:bg-white/5 active:bg-white/10"
              }`}
            >
              {monthName.substring(0, 3)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
