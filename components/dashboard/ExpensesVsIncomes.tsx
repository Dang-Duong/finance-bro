"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const mockChartData = [
  { month: "Jan", expenses: 45000, incomes: 42000, net: -3000 },
  { month: "Feb", expenses: 38000, incomes: 46000, net: 8000 },
  { month: "Mar", expenses: 42000, incomes: 37000, net: -5000 },
  { month: "Apr", expenses: 40000, incomes: 35000, net: -5000 },
  { month: "May", expenses: 35000, incomes: 42000, net: 7000 },
  { month: "Jun", expenses: 41000, incomes: 35000, net: -6000 },
  { month: "Jul", expenses: 36000, incomes: 38000, net: 2000 },
  { month: "Aug", expenses: 34000, incomes: 38000, net: 4000 },
  { month: "Sep", expenses: 33000, incomes: 38000, net: 5000 },
  { month: "Oct", expenses: 32000, incomes: 42000, net: 10000 },
  { month: "Nov", expenses: 36000, incomes: 38000, net: 2000 },
  { month: "Dec", expenses: 39000, incomes: 35000, net: -4000 },
];

const yearlyTotal = mockChartData.reduce((sum, item) => sum + item.net, 0);

export default function ExpensesVsIncomes() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10 lg:col-span-2"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Expanses vs Incomes
      </h2>

      {/* Yearly Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-6"
      >
        <span className="text-green-500 text-xl">↑</span>
        <span className="text-white font-semibold">
          + {Math.abs(yearlyTotal).toLocaleString("cs-CZ")} CZK this year
          2022-2023
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Monthly Summary Table */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Expanses vs Incomes
          </h2>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex items-center gap-2 mb-4"
          >
            <span className="text-green-500 text-xl">↑</span>
            <span className="text-white font-semibold">
              + {Math.abs(yearlyTotal).toLocaleString("cs-CZ")} CZK this year
              2022-2023
            </span>
          </motion.div>

          <div className="grid grid-cols-2 gap-2">
            {mockChartData.map((item, index) => {
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
        </div>

        {/* Right: Chart */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-white/80">Expanses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-white/80">Incomes</span>
            </div>
          </div>

          <div className="text-sm text-white/60 mb-2">
            12.04.2022 - 12.04.2023
          </div>

          <div className="flex gap-2 mb-4">
            {["Week", "Month", "Year"].map((period) => (
              <motion.button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-1 text-sm rounded transition-colors ${
                  selectedPeriod === period
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-white/80 hover:bg-white/20"
                }`}
              >
                {period}
              </motion.button>
            ))}
          </div>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="month"
                  stroke="#ffffff60"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#ffffff60"
                  style={{ fontSize: "12px" }}
                  domain={[10000, 50000]}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "8px",
                    color: "#fff",
                  }}
                />
                <Legend wrapperStyle={{ color: "#ffffff80" }} />
                <Bar
                  dataKey="expenses"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="incomes"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
