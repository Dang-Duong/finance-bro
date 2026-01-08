"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./Calendar";

interface DateRangePickerProps {
  startDate: string | null; // ISO date string or null
  endDate: string | null; // ISO date string or null
  onChange: (startDate: string | null, endDate: string | null) => void;
  placeholder?: string;
}

export default function DateRangePicker({
  startDate,
  endDate,
  onChange,
  placeholder = "Select date range",
}: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const startDateObj = startDate ? new Date(startDate) : null;
  const endDateObj = endDate ? new Date(endDate) : null;
  const displayDate = startDateObj || endDateObj || new Date();

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatRange = () => {
    if (startDate && endDate) {
      return `${formatDate(new Date(startDate))} - ${formatDate(
        new Date(endDate)
      )}`;
    } else if (startDate) {
      return `${formatDate(new Date(startDate))} - ...`;
    } else if (endDate) {
      return `... - ${formatDate(new Date(endDate))}`;
    }
    return null;
  };

  const handleStartDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (endDate && new Date(dateString) > new Date(endDate)) {
      onChange(dateString, null);
    } else {
      onChange(dateString, endDate);
    }
  };

  const handleEndDateSelect = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const dateString = `${year}-${month}-${day}`;

    if (startDate && new Date(dateString) < new Date(startDate)) {
      onChange(null, dateString);
    } else {
      onChange(startDate, dateString);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null, null);
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

  const hasValue = startDate || endDate;

  return (
    <div ref={containerRef} className="relative">
      <div className="flex items-center gap-2 min-w-[240px]">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="h-9 flex-1 rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 hover:ring-slate-500 focus:ring-2 focus:ring-primary transition-all flex items-center justify-between"
        >
          <span className={hasValue ? "text-slate-100" : "text-slate-400"}>
            {hasValue ? formatRange() : placeholder}
          </span>
        </button>
        {hasValue && (
          <button
            type="button"
            onClick={handleClear}
            className="h-9 w-9 rounded-md bg-[#07152c] text-slate-400 hover:text-slate-200 hover:bg-[#07152c]/80 outline-none ring-1 ring-slate-600 hover:ring-slate-500 transition-colors flex items-center justify-center"
            aria-label="Clear date range"
          >
            ×
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 lg:hidden"
              onClick={() => {
                setIsOpen(false);
              }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-[#1a2b3d] rounded-lg shadow-2xl border border-white/10 p-4 max-h-[90vh] w-full max-w-[680px] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-4">
                  <div className="flex gap-2 text-xs text-white/60 mb-3">
                    {startDate && (
                      <span>Start: {formatDate(new Date(startDate))}</span>
                    )}
                    {endDate && (
                      <span>End: {formatDate(new Date(endDate))}</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 text-center">
                      Start Date
                    </h4>
                    <Calendar
                      selectedDate={startDateObj || displayDate}
                      onDateSelect={handleStartDateSelect}
                      startDate={startDateObj}
                      endDate={endDateObj}
                    />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-white mb-2 text-center">
                      End Date
                    </h4>
                    <Calendar
                      selectedDate={
                        endDateObj ||
                        (startDateObj
                          ? new Date(
                              startDateObj.getFullYear(),
                              startDateObj.getMonth() + 1,
                              1
                            )
                          : new Date(
                              displayDate.getFullYear(),
                              displayDate.getMonth() + 1,
                              1
                            ))
                      }
                      onDateSelect={handleEndDateSelect}
                      startDate={startDateObj}
                      endDate={endDateObj}
                    />
                  </div>
                </div>
                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="flex-1 px-4 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Done
                  </button>
                </div>
              </motion.div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.2 }}
              className="hidden lg:block absolute top-full left-0 mt-2 z-50 bg-[#1a2b3d] rounded-lg shadow-2xl border border-white/10 p-6 w-[840px]"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4">
                <div className="flex gap-2 text-xs text-white/60">
                  {startDate && (
                    <span>Start: {formatDate(new Date(startDate))}</span>
                  )}
                  {endDate && <span>End: {formatDate(new Date(endDate))}</span>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 text-center">
                    Start Date
                  </h4>
                  <Calendar
                    selectedDate={startDateObj || displayDate}
                    onDateSelect={handleStartDateSelect}
                    startDate={startDateObj}
                    endDate={endDateObj}
                  />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-white mb-2 text-center">
                    End Date
                  </h4>
                  <Calendar
                    selectedDate={
                      endDateObj ||
                      (startDateObj
                        ? new Date(
                            startDateObj.getFullYear(),
                            startDateObj.getMonth() + 1,
                            1
                          )
                        : new Date(
                            displayDate.getFullYear(),
                            displayDate.getMonth() + 1,
                            1
                          ))
                    }
                    onDateSelect={handleEndDateSelect}
                    startDate={startDateObj}
                    endDate={endDateObj}
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleClose}
                  className="px-6 py-2 rounded-md bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
