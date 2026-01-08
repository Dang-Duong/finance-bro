"use client";

import { useMemo } from "react";
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
import { useBudgets } from "@/lib/budgetsContext";

type CategoryData = {
  category: string;
  budget: number;
  spent: number;
  net: number;
};

export default function BudgetVsSpent() {
  const { filteredBudgets, loading } = useBudgets();

  const chartData = useMemo<CategoryData[]>(() => {
    const capitalizeFirst = (str: string) => {
      if (!str) return str;
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    };

    return filteredBudgets.map((budget) => ({
      category: capitalizeFirst(budget.category.name),
      budget: budget.amount,
      spent: budget.spent,
      net: budget.amount - budget.spent,
    }));
  }, [filteredBudgets]);

  return (
    <motion.div
      className="rounded-lg p-6
        bg-white dark:bg-white/5
        border border-gray-200 dark:border-white/10"
    >
      <div className="flex items-center gap-4 mb-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-sm text-gray-700 dark:text-white/80">
            Budget
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span className="text-sm text-gray-700 dark:text-white/80">
            Spent
          </span>
        </div>
      </div>

      <div className="h-64">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600 dark:text-gray-400">Loading...</div>
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-600 dark:text-gray-400">
              No budget data available
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="currentColor"
                className="text-gray-300 dark:text-white/20"
              />
              <XAxis
                dataKey="category"
                stroke="currentColor"
                className="text-gray-700 dark:text-white/60"
                style={{ fontSize: "12px" }}
              />
              <YAxis
                stroke="currentColor"
                className="text-gray-700 dark:text-white/60"
                style={{ fontSize: "12px" }}
                domain={[0, (dataMax: number) => Math.ceil(dataMax * 1.1)]}
                tickFormatter={(value) => value.toLocaleString()}
              />
              <Tooltip />
              <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
