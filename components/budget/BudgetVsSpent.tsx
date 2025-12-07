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
    const chartDataArray: CategoryData[] = CATEGORY_DATA.map((item) => {
      return {
        category: item.category,
        budget: item.budget,
        spent: item.spent,
        net: item.budget - item.spent,
      };
    });
    setChartData(chartDataArray);
  }, []);

  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.budget, d.spent)),
    11000
  );

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
          {chartData.length > 0 && (
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
          )}
        </div>
      </div>
    </motion.div>
  );
}
