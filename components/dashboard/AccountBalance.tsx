"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Sector,
} from "recharts";
import { useTransactions } from "@/lib/transactionsContext";

const COLORS = {
  income: "#22c55e", // green
  expense: "#ef4444", // red
};

export default function AccountBalance() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { transactions, loading } = useTransactions();

  // Calculate totals
  const totalIncome = transactions
    .filter((t) => t.incoming)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions
    .filter((t) => !t.incoming)
    .reduce((sum, t) => sum + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  // Calculate this month's net
  const now = new Date();
  const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthTransactions = transactions.filter((t) => {
    const transactionDate = new Date(t.date);
    return transactionDate >= thisMonthStart;
  });
  const thisMonthIncome = thisMonthTransactions
    .filter((t) => t.incoming)
    .reduce((sum, t) => sum + t.amount, 0);
  const thisMonthExpenses = thisMonthTransactions
    .filter((t) => !t.incoming)
    .reduce((sum, t) => sum + t.amount, 0);
  const thisMonthNet = thisMonthIncome - thisMonthExpenses;

  const chartData = [
    { name: "Income", value: thisMonthIncome, color: COLORS.income },
    { name: "Expenses", value: thisMonthExpenses, color: COLORS.expense },
  ].filter((item) => item.value > 0);

  const totalThisMonth = thisMonthIncome + thisMonthExpenses;
  const highlightedItem =
    activeIndex !== null && chartData[activeIndex]
      ? chartData[activeIndex]
      : null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/5 rounded-lg p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Account Balance
        </h2>
        <div className="text-white/60">Loading...</div>
      </motion.div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Account Balance</h2>

      <div className="text-white/60 text-xs mb-4">Overall Balance</div>
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold mb-4 text-white"
      >
        {totalBalance.toLocaleString("en-US")} CZK
      </motion.div>

      <div className="border-t border-white/10 mb-4"></div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.income }}
          />
          <span className="text-sm text-white/80">
            Income: {thisMonthIncome.toLocaleString("en-US")} CZK
          </span>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: COLORS.expense }}
          />
          <span className="text-sm text-white/80">
            Expenses: {thisMonthExpenses.toLocaleString("en-US")} CZK
          </span>
        </motion.div>
      </div>

      <div className="relative h-64">
        {chartData.length > 0 ? (
          <>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={1000}
                  {...(activeIndex !== null && {
                    activeIndex: activeIndex,
                    activeShape: (props: unknown) => {
                      const {
                        cx,
                        cy,
                        innerRadius,
                        outerRadius,
                        startAngle,
                        endAngle,
                        fill,
                      } = props as {
                        cx: number;
                        cy: number;
                        innerRadius: number;
                        outerRadius: number;
                        startAngle: number;
                        endAngle: number;
                        fill: string;
                      };
                      return (
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                          style={{
                            filter: `drop-shadow(0 0 12px ${fill}80)`,
                            cursor: "pointer",
                            transition: "filter 0.3s ease-in-out",
                          }}
                        />
                      );
                    },
                  })}
                  onMouseEnter={(_, index) => {
                    setActiveIndex(index);
                  }}
                  onMouseLeave={() => {
                    setActiveIndex(null);
                  }}
                >
                  {chartData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      style={{
                        cursor: "pointer",
                        transition: "filter 0.2s ease-in-out",
                      }}
                    />
                  ))}
                </Pie>
                <Legend wrapperStyle={{ display: "none" }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              {highlightedItem && chartData.length > 0 ? (
                <motion.div
                  key={highlightedItem.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <div
                    className="text-2xl font-semibold mb-1"
                    style={{ color: highlightedItem.color }}
                  >
                    {totalThisMonth > 0
                      ? Math.round(
                          (highlightedItem.value / totalThisMonth) * 100
                        )
                      : 0}
                    %
                  </div>
                  <div className="text-white/80 text-sm mb-1">
                    {highlightedItem.name}
                  </div>
                  <div
                    className="text-sm font-semibold"
                    style={{ color: highlightedItem.color }}
                  >
                    {highlightedItem.value.toLocaleString("en-US")} CZK
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="default-view"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.2 }}
                  className="text-center"
                >
                  <div
                    className={`text-2xl mb-1 ${
                      thisMonthNet >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {thisMonthNet >= 0 ? "↑" : "↓"}
                  </div>
                  <div
                    className={`text-sm font-semibold ${
                      thisMonthNet >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {thisMonthNet >= 0 ? "+" : ""}
                    {thisMonthNet.toLocaleString("en-US")} CZK
                  </div>
                  <div className="text-white/60 text-xs">this month</div>
                </motion.div>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-white/60">
            No transaction data
          </div>
        )}
      </div>
    </motion.div>
  );
}
