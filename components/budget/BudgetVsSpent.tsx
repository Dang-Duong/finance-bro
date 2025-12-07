"use client";

import { useState, useEffect } from "react";
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
import { useTransactions } from "@/lib/transactionsContext";

type CategoryData = {
  category: string;
  budget: number;
  spent: number;
  net: number;
};

const CATEGORY_BUDGETS: { [key: string]: number } = {
  Food: 5000,
  Housing: 10000,
  Transport: 5000,
  Subscription: 1500,
};

export default function BudgetVsSpent() {
  const { transactions, loading } = useTransactions();
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (transactions.length > 0 || !loading) {
      calculateChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const calculateChartData = () => {
    const categorySpent: { [key: string]: number } = {};

    Object.keys(CATEGORY_BUDGETS).forEach((category) => {
      categorySpent[category] = 0;
    });

    transactions.forEach((transaction) => {
      if (!transaction.incoming) {
        const category =
          typeof transaction.category === "string"
            ? transaction.category
            : typeof transaction.category === "object" &&
              transaction.category !== null
            ? transaction.category.name
            : "Other";

        if (CATEGORY_BUDGETS[category]) {
          categorySpent[category] =
            (categorySpent[category] || 0) + transaction.amount;
        }
      }
    });

    const chartDataArray: CategoryData[] = Object.keys(CATEGORY_BUDGETS).map(
      (category) => {
        const budget = CATEGORY_BUDGETS[category];
        const spent = categorySpent[category] || 0;
        return {
          category: category,
          budget: budget,
          spent: spent,
          net: budget - spent,
        };
      }
    );

    setChartData(chartDataArray);
  };

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.budget, d.spent)),
    10000
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/5 rounded-lg p-6 border border-white/10"
      >
        <div className="text-white/60">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <div className="flex flex-col">
        <div className="flex items-center gap-4 mb-2">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-sm text-white/80">Budget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <span className="text-sm text-white/80">Spent</span>
          </div>
        </div>

        <div className="h-64">
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                <XAxis
                  dataKey="category"
                  stroke="#ffffff60"
                  style={{ fontSize: "12px" }}
                />
                <YAxis
                  stroke="#ffffff60"
                  style={{ fontSize: "12px" }}
                  domain={[0, maxValue * 1.1]}
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
                  dataKey="budget"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
                <Bar
                  dataKey="spent"
                  fill="#ef4444"
                  radius={[4, 4, 0, 0]}
                  animationDuration={1000}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              No budget data
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
