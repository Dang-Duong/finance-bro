"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import { useTransactions } from "@/lib/transactionsContext";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function Transactions() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { transactions, loading, refreshTransactions } = useTransactions();

  const formatDate = (date: string | Date) => {
    const d = new Date(date);
    return d.toLocaleDateString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getCategoryName = (
    category: string | { _id: string; name: string } | null | undefined
  ): string => {
    if (typeof category === "string") return category;
    if (typeof category === "object" && category !== null) return category.name;
    return "N/A";
  };

  const getFrequencyLabel = (frequency?: "weekly" | "monthly" | "yearly") => {
    if (!frequency) return "";
    const labels = {
      weekly: "Weekly",
      monthly: "Monthly",
      yearly: "Yearly",
    };
    return labels[frequency];
  };

  const handleSubmit = async (data: {
    category: string;
    type: "Income" | "Expense";
    amount: number;
    description: string;
    date: Date;
    isRepeating?: boolean;
    frequency?: "weekly" | "monthly" | "yearly";
  }) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: data.amount,
          description: data.description,
          incoming: data.type === "Income",
          date: data.date.toISOString(),
          category: data.category,
          isRepeating: data.isRepeating,
          frequency: data.frequency,
        }),
      });

      if (response.ok) {
        await response.json();
        setIsModalOpen(false);
        refreshTransactions();
      } else {
        alert("Failed to create transaction.");
      }
    } catch {
      alert("Error creating transaction.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="
          h-[440px] flex flex-col
          rounded-lg p-6 border relative z-30
          bg-white dark:bg-white/5
          border-gray-200 dark:border-white/10
        "
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Transactions
          </h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Add transactions
          </motion.button>
        </div>

        {/* Mobile layout */}
        <div className="lg:hidden space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {loading ? (
            <div className="py-12 flex justify-center">
              <LoadingSpinner size="md" />
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-gray-600 dark:text-white/60">
              No transactions yet. Add your first transaction!
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="
                  rounded-lg p-4 border
                  bg-white dark:bg-white/5
                  border-gray-200 dark:border-white/10
                "
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-800 dark:text-white/80">
                        {getCategoryName(transaction.category)}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-gray-100 text-gray-600 dark:bg-white/10 dark:text-white/60">
                        {transaction.incoming ? "Income" : "Expense"}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 dark:text-white/60 mb-1">
                      {formatDate(transaction.date)}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-gray-700 dark:text-white/70">
                        {transaction.description}
                      </p>
                    )}
                    {transaction.isRepeating && transaction.frequency && (
                      <span className="inline-flex items-center mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-300 border border-blue-500/30">
                        🔄 {getFrequencyLabel(transaction.frequency)}
                      </span>
                    )}
                  </div>
                  <div
                    className={`text-lg font-semibold ml-4 ${
                      transaction.incoming ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {transaction.incoming ? "+" : "-"}
                    {transaction.amount.toLocaleString("cs-CZ")} CZK
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Desktop table */}
        <div className="hidden lg:block flex-1 overflow-y-auto pr-2 custom-scrollbar">
          <table className="w-full border-collapse">
            <thead className="sticky top-0 bg-white dark:bg-[#12293e] z-10">
              <tr className="border-b border-gray-200 dark:border-white/10">
                {["Date", "Category", "Type", "Amount", "Description"].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left py-3 px-2 text-sm font-medium text-gray-600 dark:text-white/60"
                    >
                      {h}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex justify-center">
                      <LoadingSpinner size="md" />
                    </div>
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-600 dark:text-white/60"
                  >
                    No transactions yet. Add your first transaction!
                  </td>
                </tr>
              ) : (
                transactions.map((transaction, index) => (
                  <motion.tr
                    key={transaction._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                    className="
                      border-b
                      border-gray-100 dark:border-white/5
                      hover:bg-gray-50 dark:hover:bg-white/5
                      transition-colors
                    "
                  >
                    <td className="py-3 px-2 text-sm text-gray-700 dark:text-white/80">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-700 dark:text-white/80">
                      {getCategoryName(transaction.category)}
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-700 dark:text-white/80">
                      {transaction.incoming ? "Income" : "Expense"}
                    </td>
                    <td
                      className={`py-3 px-2 text-sm font-semibold ${
                        transaction.incoming ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.amount.toLocaleString("cs-CZ")} CZK
                    </td>
                    <td className="py-3 px-2 text-sm text-gray-700 dark:text-white/80">
                      {transaction.description}
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </>
  );
}
