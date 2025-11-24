"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import CloseIcon from "@/components/icons/CloseIcon";
import Calendar from "./Calendar";
import { useCategories } from "@/lib/categoriesContext";

type TransactionType = "Income" | "Expense";
type Frequency = "weekly" | "monthly" | "yearly";

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    category: string;
    type: TransactionType;
    amount: number;
    description: string;
    date: Date;
    isRepeating?: boolean;
    frequency?: Frequency;
  }) => Promise<void>;
  editingTransaction?: {
    _id?: string;
    id?: string;
    date?: string | Date | null;
    category?: string | { _id: string; name: string } | null;
    incoming?: boolean | null;
    type?: "Income" | "Expense";
    amount?: number | null;
    description?: string | null;
    isRepeating?: boolean;
    frequency?: Frequency;
  };
}

export default function AddTransactionModal({
  isOpen,
  onClose,
  onSubmit,
  editingTransaction,
}: AddTransactionModalProps) {
  const { categories, loading: categoriesLoading } = useCategories();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [selectedType, setSelectedType] = useState<TransactionType>("Income");
  const [amount, setAmount] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [error, setError] = useState<string>("");
  const [isRepeating, setIsRepeating] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<Frequency>("monthly");

  useEffect(() => {
    if (editingTransaction && isOpen && categories.length > 0) {
      let categoryId = "";
      const transactionCategory = editingTransaction.category;
      if (transactionCategory) {
        if (typeof transactionCategory === "string") {
          const category = categories.find(
            (c) => c.name.toLowerCase() === transactionCategory.toLowerCase()
          );
          categoryId = category?._id || "";
        } else if (transactionCategory._id) {
          categoryId = transactionCategory._id;
        }
      }

      setSelectedCategoryId(categoryId);

      let transactionType: TransactionType = "Expense";
      if (typeof editingTransaction.incoming === "boolean") {
        transactionType = editingTransaction.incoming ? "Income" : "Expense";
      } else {
        transactionType =
          editingTransaction.type === "Income" ? "Income" : "Expense";
      }
      setSelectedType(transactionType);

      setAmount(String(editingTransaction.amount ?? ""));
      setDescription(editingTransaction.description || "");
      setSelectedDate(
        editingTransaction.date ? new Date(editingTransaction.date) : new Date()
      );
      setIsRepeating(editingTransaction.isRepeating || false);
      setFrequency(editingTransaction.frequency || "monthly");
    }
  }, [editingTransaction, isOpen, categories]);

  useEffect(() => {
    if (!isOpen || (isOpen && !editingTransaction)) {
      setSelectedCategoryId("");
      setSelectedType("Income");
      setAmount("");
      setDescription("");
      setSelectedDate(new Date());
      setError("");
      setIsRepeating(false);
      setFrequency("monthly");
    }
  }, [isOpen, editingTransaction]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedCategoryId || !amount) {
      return false;
    }

    setError("");
    try {
      await onSubmit({
        category: selectedCategoryId,
        type: selectedType,
        amount: parseFloat(amount),
        description,
        date: selectedDate,
        isRepeating: isRepeating,
        frequency: isRepeating ? frequency : undefined,
      });
      setSelectedCategoryId("");
      setSelectedType("Income");
      setAmount("");
      setDescription("");
      setSelectedDate(new Date());
      setIsRepeating(false);
      setFrequency("monthly");
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to submit transaction";
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
              className="bg-[#1a2b3d] rounded-none lg:rounded-2xl w-full lg:max-w-4xl h-full lg:h-auto lg:max-h-[90vh] flex flex-col lg:flex-row shadow-2xl relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-20 p-2.5 text-white/90 hover:text-white active:bg-white/20 hover:bg-white/10 rounded-lg transition-colors touch-manipulation bg-white/10 lg:bg-transparent"
                aria-label="Close modal"
              >
                <CloseIcon className="w-6 h-6" />
              </button>

              <div className="flex-1 p-4 lg:p-8 overflow-y-auto min-h-0 max-h-[50vh] lg:max-h-none">
                <h2 className="text-xl lg:text-2xl font-semibold text-white mb-4 lg:mb-6 pr-10">
                  {editingTransaction ? "Edit transaction" : "Add transaction"}
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
                      Type
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedType("Income");
                          setError("");
                        }}
                        className={`flex-1 px-4 lg:px-6 py-2 rounded-full text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                          selectedType === "Income"
                            ? "bg-green-500 text-white border-2 border-green-500"
                            : "bg-transparent text-green-400 border-2 border-green-500/50 hover:border-green-500/70 active:border-green-500"
                        }`}
                      >
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedType("Expense");
                          setError("");
                        }}
                        className={`flex-1 px-4 lg:px-6 py-2 rounded-full text-sm font-medium transition-all touch-manipulation active:scale-95 ${
                          selectedType === "Expense"
                            ? "bg-red-500 text-white border-2 border-red-500"
                            : "bg-transparent text-red-400 border-2 border-red-500/50 hover:border-red-500/70 active:border-red-500"
                        }`}
                      >
                        Expense
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Amount
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Description
                    </label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => {
                        setDescription(e.target.value);
                        setError("");
                      }}
                      placeholder="Enter description"
                      className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2 lg:mb-3">
                      Recurring Transaction
                    </label>
                    <div className="flex items-center gap-3 mb-3">
                      <button
                        type="button"
                        onClick={() => {
                          setIsRepeating(!isRepeating);
                          setError("");
                        }}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-[#1a2b3d] ${
                          isRepeating ? "bg-primary" : "bg-white/30"
                        }`}
                        role="switch"
                        aria-checked={isRepeating}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            isRepeating ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                      <span className="text-sm text-white/80">
                        Allow repeated transaction
                      </span>
                    </div>
                    {isRepeating && (
                      <div>
                        <label className="block text-xs font-medium text-white/70 mb-2">
                          Frequency
                        </label>
                        <select
                          value={frequency}
                          onChange={(e) => {
                            setFrequency(e.target.value as Frequency);
                            setError("");
                          }}
                          className="w-full px-4 py-2.5 lg:py-3 bg-white/10 border-2 border-white/30 rounded-lg text-white focus:outline-none focus:border-white/60 transition-colors text-base lg:text-sm"
                        >
                          <option value="weekly" className="bg-[#1a2b3d]">
                            Weekly
                          </option>
                          <option value="monthly" className="bg-[#1a2b3d]">
                            Monthly
                          </option>
                          <option value="yearly" className="bg-[#1a2b3d]">
                            Yearly
                          </option>
                        </select>
                      </div>
                    )}
                  </div>

                  {error && (
                    <div className="mt-4 p-3 rounded-lg text-sm bg-red-500/20 text-red-300 border border-red-500/30">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-hover active:bg-primary-hover transition-colors mt-4 lg:mt-8 touch-manipulation text-base lg:text-sm"
                  >
                    {editingTransaction
                      ? "Update transaction"
                      : "Add transaction"}
                  </button>
                </form>
              </div>

              <div className="flex-1 p-4 lg:p-8 pt-6 lg:pt-16 border-t lg:border-t-0 lg:border-l border-white/10 bg-[#152431] overflow-y-auto min-h-0 max-h-[50vh] lg:max-h-none">
                <Calendar
                  selectedDate={selectedDate}
                  onDateSelect={(date) => {
                    setSelectedDate(date);
                    setError("");
                  }}
                />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
