"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import AddTransactionModal from "@/components/transactions/AddTransactionModal";
import { useTransactions } from "@/lib/transactionsContext";

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

  const handleSubmit = async (data: {
    category: string;
    type: "Income" | "Expense";
    amount: number;
    description: string;
    date: Date;
  }) => {
    try {
      const response = await fetch("/api/transactions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: data.amount,
          description: data.description,
          incoming: data.type === "Income",
          date: data.date.toISOString(),
          category: data.category,
        }),
      });

      if (response.ok) {
        await response.json();
        setIsModalOpen(false);
        refreshTransactions();
      } else {
        console.error("Failed to create transaction");
        alert("Failed to create transaction. Please try again.");
      }
    } catch (error) {
      console.error("Error creating transaction:", error);
      alert("Error creating transaction. Please try again.");
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="bg-white/5 rounded-lg p-6 border border-white/10 relative z-30"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Transactions</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
          >
            Add transactions
          </motion.button>
        </div>

        {/* Mobile Card Layout */}
        <div className="lg:hidden space-y-3">
          {loading ? (
            <div className="py-8 text-center text-white/60">
              Loading transactions...
            </div>
          ) : transactions.length === 0 ? (
            <div className="py-8 text-center text-white/60">
              No transactions yet. Add your first transaction!
            </div>
          ) : (
            transactions.map((transaction, index) => (
              <motion.div
                key={transaction._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="bg-white/5 rounded-lg p-4 border border-white/10"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-white/80">
                        {transaction.category || "N/A"}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-white/60">
                        {transaction.incoming ? "Income" : "Expense"}
                      </span>
                    </div>
                    <p className="text-xs text-white/60 mb-1">
                      {formatDate(transaction.date)}
                    </p>
                    {transaction.description && (
                      <p className="text-sm text-white/70">
                        {transaction.description}
                      </p>
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

        {/* Desktop Table Layout */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-sm text-white/60 font-medium">
                  Date
                </th>
                <th className="text-left py-3 px-2 text-sm text-white/60 font-medium">
                  Category
                </th>
                <th className="text-left py-3 px-2 text-sm text-white/60 font-medium">
                  Type
                </th>
                <th className="text-left py-3 px-2 text-sm text-white/60 font-medium">
                  Amount
                </th>
                <th className="text-left py-3 px-2 text-sm text-white/60 font-medium">
                  Description
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/60">
                    Loading transactions...
                  </td>
                </tr>
              ) : transactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-white/60">
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
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2 text-sm text-white/80">
                      {formatDate(transaction.date)}
                    </td>
                    <td className="py-3 px-2 text-sm text-white/80">
                      {transaction.category || "N/A"}
                    </td>
                    <td className="py-3 px-2 text-sm text-white/80">
                      {transaction.incoming ? "Income" : "Expense"}
                    </td>
                    <td
                      className={`py-3 px-2 text-sm font-semibold ${
                        transaction.incoming ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {transaction.amount.toLocaleString("cs-CZ")} CZK
                    </td>
                    <td className="py-3 px-2 text-sm text-white/80">
                      {transaction.description || "N/A"}
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
