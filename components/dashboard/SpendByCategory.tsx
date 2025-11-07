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

const COLORS = {
  food: "#22c55e", // green
  transport: "#3b82f6", // light blue
  car: "#16a34a", // dark green
  entertainment: "#1e40af", // dark blue
};

const mockData = [
  { name: "Food", value: 32, color: COLORS.food },
  { name: "Transport", value: 53, color: COLORS.transport },
  { name: "Car", value: 10, color: COLORS.car },
  { name: "Entertainment", value: 5, color: COLORS.entertainment },
];

export default function SpendByCategory() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const highlightedCategory =
    activeIndex !== null ? mockData[activeIndex] : null;

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
        <div className="flex flex-col  gap-8">
          {mockData.map((item, index) => (
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
                {item.name} {item.value}%
              </span>
            </motion.div>
          ))}
        </div>

        {/* Right: Chart */}
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={mockData}
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
                {mockData.map((entry, index) => (
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
          {highlightedCategory && (
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
