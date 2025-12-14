"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@/components/icons/CloseIcon";
import ChevronLeftIcon from "@/components/icons/ChevronLeftIcon";
import ChevronRightIcon from "@/components/icons/ChevronRightIcon";
import { useCategories } from "@/lib/categoriesContext";

interface AddBudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    amount: number;
    month: number;
    year: number;
  }) => Promise<void>;
  editingBudget?: {
    _id?: string;
    category?: { _id: string; name: string };
    amount?: number;
    month?: number;
    year?: number;
  };
}

export default function AddBudgetModal({
  isOpen,
  onClose,
  onSubmit,
  editingBudget,
}: AddBudgetModalProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [currentYear, setCurrentYear] = useState<number>(
    new Date().getFullYear()
  );
  const [error, setError] = useState<string>("");

  // Convert month string "YYYY-MM" to { month: 0-11, year: number }
  const parseMonthString = (monthString: string | null) => {
    if (!monthString) return null;
    const [yearStr, monthStr] = monthString.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1; // Convert to 0-indexed
    return { month, year };
  };

  useEffect(() => {
    if (editingBudget && isOpen && categories.length > 0) {
      const categoryId = editingBudget.category?._id || "";
      setSelectedCategoryId(categoryId);
      setAmount(String(editingBudget.amount ?? ""));

      // Set month picker value from editingBudget
      if (
        editingBudget.month !== undefined &&
        editingBudget.year !== undefined
      ) {
        const monthString = `${editingBudget.year}-${String(
          editingBudget.month + 1
        ).padStart(2, "0")}`;
        setSelectedMonth(monthString);
        setCurrentYear(editingBudget.year);
      }
    }
  }, [editingBudget, isOpen, categories]);

  useEffect(() => {
    if (!isOpen || (isOpen && !editingBudget)) {
      setSelectedCategoryId("");
      setAmount("");
      setSelectedMonth(null);
      setCurrentYear(new Date().getFullYear());
      setError("");
    }
  }, [isOpen, editingBudget]);

  // Sync currentYear with selectedMonth
  useEffect(() => {
    if (selectedMonth) {
      const [yearStr] = selectedMonth.split("-");
      const year = parseInt(yearStr, 10);
      if (!isNaN(year)) {
        setCurrentYear(year);
      }
    }
  }, [selectedMonth]);

  const handleMonthSelect = (year: number, month: number) => {
    const monthString = `${year}-${String(month + 1).padStart(2, "0")}`;
    setSelectedMonth(monthString);
    setError("");
  };

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
    if (!selectedMonth) return false;
    const [yearStr, monthStr] = selectedMonth.split("-");
    const year = parseInt(yearStr, 10);
    const monthNum = parseInt(monthStr, 10) - 1;
    return monthNum === month && year === currentYear;
  };

  const isCurrentMonth = (month: number) => {
    const today = new Date();
    return today.getMonth() === month && today.getFullYear() === currentYear;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedCategoryId || !amount || !selectedMonth) {
      setError("Please fill in all fields");
      return false;
    }

    const parsedMonth = parseMonthString(selectedMonth);
    if (!parsedMonth) {
      setError("Please select a valid month");
      return false;
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError("Amount must be greater than 0");
      return false;
    }

    setError("");
    try {
      await onSubmit({
        category: selectedCategoryId,
        amount: amountNum,
        month: parsedMonth.month,
        year: parsedMonth.year,
      });
      setSelectedCategoryId("");
      setAmount("");
      setSelectedMonth(null);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit budget";
      setError(errorMessage);
      console.error("Error submitting form:", error);
    }

    return false;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          <div
            className="fixed inset-0 z-50 flex items-start lg:items-center justify-center p-0 lg:p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a2b3d] rounded-none lg:rounded-2xl w-full lg:max-w-2xl h-full lg:h-auto lg:max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2.5 text-white/90 hover:text-white active:bg-white/20 hover:bg-white/10 rounded-lg transition-colors touch-manipulation bg-white/10 lg:bg-transparent"
                aria-label="Close modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>

              <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-h-0">
                <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6 pr-10">
                  {editingBudget ? "Edit budget" : "Add budget"}
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 lg:space-y-6"
                  noValidate
                >
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Category
                    </label>
                    {categoriesLoading ? (
                      <div className="text-white/50 text-sm">
                        Loading categories...
                      </div>
                    ) : categories.length === 0 ? (
                      <div className="text-white/50 text-sm">
                        No categories available
                      </div>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 lg:gap-2">
                        {categories.map((category) => {
                          const capitalizeFirst = (str: string) => {
                            if (!str) return str;
                            return (
                              str.charAt(0).toUpperCase() +
                              str.slice(1).toLowerCase()
                            );
                          };
                          return (
                            <button
                              key={category._id}
                              type="button"
                              onClick={() => {
                                setSelectedCategoryId(category._id);
                                setError("");
                              }}
                              className={`px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                                selectedCategoryId === category._id
                                  ? "bg-white text-[#1a2b3d] border-2 border-white"
                                  : "bg-transparent text-white/70 border-2 border-white/30 hover:border-white/50 active:border-white/70"
                              }`}
                            >
                              {capitalizeFirst(category.name)}
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Amount (CZK)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => {
                        setAmount(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Month & Year
                    </label>
                    <div className="bg-white/5 border-2 border-white/30 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <button
                          type="button"
                          onClick={handlePreviousYear}
                          className="text-white/70 hover:text-white active:text-white transition-colors p-2 touch-manipulation"
                          aria-label="Previous year"
                        >
                          <ChevronLeftIcon className="w-5 h-5" />
                        </button>
                        <h3 className="text-base lg:text-lg font-semibold text-white text-center px-2">
                          {currentYear}
                        </h3>
                        <button
                          type="button"
                          onClick={handleNextYear}
                          className="text-white/70 hover:text-white active:text-white transition-colors p-2 touch-manipulation"
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
                              type="button"
                              onClick={() =>
                                handleMonthSelect(currentYear, index)
                              }
                              className={`px-3 py-2 text-sm font-medium rounded-md lg:rounded-lg transition-all touch-manipulation active:scale-95 ${
                                selected
                                  ? "bg-blue-600 text-white"
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
                  </div>

                  {error && (
                    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                      {error}
                    </div>
                  )}

                  <div className="flex gap-3 pt-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="flex-1 px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white hover:bg-white/20 transition-colors text-sm font-medium"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg text-white transition-colors text-sm font-medium"
                    >
                      {editingBudget ? "Update" : "Create"} Budget
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
