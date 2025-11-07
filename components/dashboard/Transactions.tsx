"use client";

import { motion } from "framer-motion";

type Transaction = {
  date: string;
  category: string;
  type: "Expense" | "Income";
  amount: number;
  description: string;
};

const mockTransactions: Transaction[] = [
  {
    date: "5. August 2024",
    category: "Food",
    type: "Expense",
    amount: 120,
    description: "MC Donald",
  },
  {
    date: "15. August 2024",
    category: "Food",
    type: "Expense",
    amount: 280,
    description: "Pizza",
  },
  {
    date: "17. August 2024",
    category: "Transport",
    type: "Expense",
    amount: 535,
    description: "Gas station",
  },
  {
    date: "23. August 2024",
    category: "Netflix",
    type: "Expense",
    amount: 230,
    description: "Subscription",
  },
  {
    date: "23. August 2024",
    category: "Work",
    type: "Income",
    amount: 50987,
    description: "Salary",
  },
];

export default function Transactions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-white">Transactions</h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
        >
          Add transactions
        </motion.button>
      </div>

      <div className="overflow-x-auto">
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
            {mockTransactions.map((transaction, index) => (
              <motion.tr
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + index * 0.1 }}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="py-3 px-2 text-sm text-white/80">
                  {transaction.date}
                </td>
                <td className="py-3 px-2 text-sm text-white/80">
                  {transaction.category}
                </td>
                <td className="py-3 px-2 text-sm text-white/80">
                  {transaction.type}
                </td>
                <td
                  className={`py-3 px-2 text-sm font-semibold ${
                    transaction.type === "Income"
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {transaction.amount.toLocaleString("cs-CZ")} CZK
                </td>
                <td className="py-3 px-2 text-sm text-white/80">
                  {transaction.description}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}
