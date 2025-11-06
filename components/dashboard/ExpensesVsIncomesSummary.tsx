"use client";

import { motion } from "framer-motion";

const mockMonthlyData = [
  { month: "Jan", net: -3000 },
  { month: "Feb", net: 8000 },
  { month: "Mar", net: -5000 },
  { month: "Apr", net: -5000 },
  { month: "May", net: 7000 },
  { month: "Jun", net: -6000 },
  { month: "Jul", net: 2000 },
  { month: "Aug", net: 4000 },
  { month: "Sep", net: 5000 },
  { month: "Oct", net: 10000 },
  { month: "Nov", net: 2000 },
  { month: "Dec", net: -4000 },
];

const yearlyTotal = mockMonthlyData.reduce((sum, item) => sum + item.net, 0);

export default function ExpensesVsIncomesSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Expanses vs Incomes</h2>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-green-500 text-xl">↑</span>
        <span className="text-white font-semibold">
          + {Math.abs(yearlyTotal).toLocaleString("cs-CZ")} CZK this year 2022-2023
        </span>
      </motion.div>

      <div className="grid grid-cols-2 gap-2">
        {mockMonthlyData.map((item, index) => {
          const isPositive = item.net > 0;
          return (
            <motion.div
              key={item.month}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
              className="flex items-center justify-between p-2 rounded bg-white/5"
            >
              <span className="text-sm text-white/80">{item.month}</span>
              <span
                className={`text-sm font-semibold ${
                  isPositive ? "text-green-500" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}
                {item.net.toLocaleString("cs-CZ")} CZK
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

