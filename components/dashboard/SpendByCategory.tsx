"use client";

import { useState, useEffect } from "react";
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

type CategoryData = {
  name: string;
  value: number;
  color: string;
  amount: number;
};

const CATEGORY_COLORS: { [key: string]: string } = {
  Food: "#22c55e",
  Transport: "#3b82f6",
  Shopping: "#f97316",
  Bills: "#ef4444",
  Entertainment: "#1e40af",
  Health: "#8b5cf6",
  Work: "#10b981",
  Other: "#6b7280",
};

const DEFAULT_COLORS = [
  "#22c55e",
  "#3b82f6",
  "#f97316",
  "#ef4444",
  "#1e40af",
  "#8b5cf6",
  "#10b981",
  "#6b7280",
];

export default function SpendByCategory() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { transactions, loading } = useTransactions();
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);

  useEffect(() => {
    if (transactions.length > 0 || !loading) {
      calculateCategoryData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions]);

  const calculateCategoryData = () => {
    // Filter only expenses
    const expenses = transactions.filter((t) => !t.incoming);

    // Group by category
    const categoryMap: { [key: string]: number } = {};
    expenses.forEach((transaction) => {
      const category = transaction.category || "Other";
      categoryMap[category] = (categoryMap[category] || 0) + transaction.amount;
    });

    // Calculate total
    const total = Object.values(categoryMap).reduce(
      (sum, amount) => sum + amount,
      0
    );

    // Convert to percentage and format
    const data: CategoryData[] = Object.keys(categoryMap)
      .map((category, index) => {
        const amount = categoryMap[category];
        const percentage = total > 0 ? (amount / total) * 100 : 0;
        return {
          name: category,
          value: Math.round(percentage),
          color:
            CATEGORY_COLORS[category] ||
            DEFAULT_COLORS[index % DEFAULT_COLORS.length],
          amount: amount,
        };
      })
      .sort((a, b) => b.amount - a.amount); // Sort by amount descending

    setCategoryData(data);
  };

  const highlightedCategory =
    activeIndex !== null && categoryData[activeIndex]
      ? categoryData[activeIndex]
      : null;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-white/5 rounded-lg p-6 border border-white/10"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Spend by Category
        </h2>
        <div className="text-white/60">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Spend by Category
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-center">
        {/* Left: Legend */}
        <div className="flex flex-col gap-8">
          {categoryData.length > 0 ? (
            categoryData.map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
              className="flex items-center gap-2"
            >
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-white/80">
                {item.name} {item.value}% (
                {item.amount.toLocaleString("en-US")} CZK)
              </span>
            </motion.div>
            ))
          ) : (
            <div className="text-white/60">No expense data</div>
          )}
        </div>

        {/* Right: Chart */}
        <div className="relative h-64">
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
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
                  {categoryData.map((entry, index) => (
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
          ) : (
            <div className="flex items-center justify-center h-full text-white/60">
              No expense data
            </div>
          )}
          {highlightedCategory && categoryData.length > 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                key={highlightedCategory.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="text-center"
              >
                <div
                  className="text-2xl font-semibold mb-1"
                  style={{ color: highlightedCategory.color }}
                >
                  {highlightedCategory.value}%
                </div>
                <div className="text-white/80 text-sm">
                  {highlightedCategory.name}
                </div>
              </motion.div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
