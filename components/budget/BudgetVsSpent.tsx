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

type CategoryData = {
  category: string;
  budget: number;
  spent: number;
  net: number;
};

const CATEGORY_DATA = [
  { category: "Food", budget: 5000, spent: 4000 },
  { category: "Housing", budget: 10000, spent: 6000 },
  { category: "Transport", budget: 5000, spent: 3500 },
  { category: "Subscription", budget: 1500, spent: 1500 },
];

export default function BudgetVsSpent() {
  const [chartData, setChartData] = useState<CategoryData[]>([]);

  useEffect(() => {
    setChartData(
      CATEGORY_DATA.map((item) => ({
        ...item,
        net: item.budget - item.spent,
      }))
    );
  }, []);

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.budget, d.spent)),
    11000
  );

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
        {chartData.length > 0 && (
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
                domain={[0, maxValue * 1.1]}
              />
              <Tooltip />
              <Legend
                wrapperStyle={{
                  color: "currentColor",
                }}
                className="text-gray-700 dark:text-white/80"
              />
              <Bar dataKey="budget" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="spent" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </motion.div>
  );
}
