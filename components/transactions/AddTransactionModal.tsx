"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "./Calendar";
import CloseIcon from "@/components/icons/CloseIcon";

type TransactionType = "Income" | "Expense";

const CATEGORIES = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Entertainment",
  "Health",
  "Work",
  "Other",
];

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: Date;
  }) => void;
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSubmit,
}: AddTransactionModalProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedType, setSelectedType] = useState<TransactionType>("Income");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || !amount) {
      return;
    }
    onSubmit({
      category: selectedCategory,
      type: selectedType,
      amount: parseFloat(amount),
      description,
      date: selectedDate,
    });
    // Reset form
    setSelectedCategory("");
    setSelectedType("Income");
    setAmount("");
    setDescription("");
    setSelectedDate(new Date());
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
          {/* Modal */}
          <div
            className="fixed inset-0 z-50 flex items-start lg:items-center justify-center p-0 lg:p-4"
            onClick={onClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-[#1a2b3d] rounded-none lg:rounded-2xl w-full lg:max-w-4xl h-full lg:h-auto lg:max-h-[90vh] flex flex-col lg:flex-row shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2.5 text-white/90 hover:text-white active:bg-white/20 hover:bg-white/10 rounded-lg transition-colors touch-manipulation bg-white/10 lg:bg-transparent"
                aria-label="Close modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>

              {/* Left Section - Form */}
              <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-h-0 max-h-[50vh] lg:max-h-none">
                <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6 pr-10">
                  Add transactions
                </h2>

                <form
                  onSubmit={handleSubmit}
                  className="space-y-3 lg:space-y-6"
                >
                  {/* Category */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Category
                    </label>
                    <div className="flex flex-wrap gap-1.5 lg:gap-2">
                      {CATEGORIES.map((category) => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setSelectedCategory(category)}
                          className={`px-2.5 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                            selectedCategory === category
                              ? "bg-white text-[#1a2b3d] border-2 border-white"
                              : "bg-transparent text-white/70 border-2 border-white/30 hover:border-white/50 active:border-white/70"
                          }`}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Type */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedType("Income")}
                        className={`flex-1 px-4 lg:px-6 py-2 rounded-full text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                          selectedType === "Income"
                            ? "bg-white text-[#1a2b3d] border-2 border-white"
                            : "bg-transparent text-white/70 border-2 border-white/30 hover:border-white/50 active:border-white/70"
                        }`}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedType("Expense")}
                        className={`flex-1 px-4 lg:px-6 py-2 rounded-full text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                          selectedType === "Expense"
                            ? "bg-white text-[#1a2b3d] border-2 border-white"
                            : "bg-transparent text-white/70 border-2 border-white/30 hover:border-white/50 active:border-white/70"
                        }`}
                      >
                        Expense
                      </button>
                    </div>
                  </div>

                  {/* Amount */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Amount
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Enter amount"
                      className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Enter description"
                      className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover active:bg-primary-hover transition-colors mt-4 lg:mt-8 touch-manipulation text-base lg:text-sm"
                  >
                    Add transactions
                  </button>
                </form>
              </div>

              {/* Right Section - Calendar */}
              <div className="flex-1 p-4 lg:p-8 pt-6 lg:pt-16 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#152431] overflow-y-auto min-h-0 max-h-[50vh] lg:max-h-none">
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={setSelectedDate}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
