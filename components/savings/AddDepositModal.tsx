"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@/components/icons/CloseIcon";
import DatePicker from "@/components/transactions/DatePicker";
import type { SavingGoal } from "@/lib/savingsContext";

interface AddDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    goalId: string;
    amount: number;
    date?: string;
  }) => Promise<void>;
  goals: SavingGoal[];
}

export default function AddDepositModal({
  isOpen,
  onClose,
  onSubmit,
  goals,
}: AddDepositModalProps) {
  const [selectedGoalId, setSelectedGoalId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<string | null>(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setSelectedGoalId("");
      setAmount("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
      setError("");
    } else if (goals.length > 0 && !selectedGoalId) {
      setSelectedGoalId(goals[0]._id);
    }
  }, [isOpen, goals, selectedGoalId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedGoalId || !amount) {
      setError("Please fill in all required fields");
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
        goalId: selectedGoalId,
        amount: amountNum,
        date: selectedDate || undefined,
      });
      setSelectedGoalId("");
      setAmount("");
      setSelectedDate(new Date().toISOString().split("T")[0]);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit deposit";
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
                  Add Deposit
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 lg:space-y-6"
                  noValidate
                >
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Goal
                    </label>
                    {goals.length === 0 ? (
                      <div className="text-white/50 text-sm">
                        No goals available. Please create a goal first.
                      </div>
                    ) : (
                      <select
                        value={selectedGoalId}
                        onChange={(e) => {
                          setSelectedGoalId(e.target.value);
                          setError("");
                        }}
                        className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                        required
                      >
                        <option value="">Select a goal</option>
                        {goals.map((goal) => (
                          <option key={goal._id} value={goal._id}>
                            {goal.name}
                          </option>
                        ))}
                      </select>
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
                      Date
                    </label>
                    <DatePicker
                      value={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setError("");
                      }}
                      placeholder="Select date"
                    />
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
                      disabled={goals.length === 0}
                      className="flex-1 px-4 py-2.5 lg:py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg text-white transition-colors text-sm font-medium"
                    >
                      Add Deposit
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
