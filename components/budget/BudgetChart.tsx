"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BudgetChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const data = [
    { label: "Food", budget: 5000, spent: 4000 },
    { label: "Housing", budget: 10000, spent: 6000 },
    { label: "Transport", budget: 5000, spent: 3500 },
    { label: "Subscription", budget: 1500, spent: 1500 },
  ];

  const maxValue = 10000;
  const barAreaHeight = 320;

  return (
    <div className="bg-[#0F1C2E] p-6 rounded-2xl w-full h-[450px] relative">
      <div className="flex h-full">
        <div
          className="flex flex-col justify-between text-gray-500 text-xs pr-6"
          style={{ height: barAreaHeight }}
        >
          <span>10000</span>
          <span>8000</span>
          <span>5000</span>
          <span>3000</span>
          <span>1000</span>
        </div>

        {/* Sloupce + popisky odděleně */}
        <div className="flex-1 flex flex-col">
          {/* oblast pro sloupce */}
          <div
            className="flex items-end justify-around relative"
            style={{ height: barAreaHeight }}
          >
            {data.map((item, idx) => {
              const height = (item.spent / maxValue) * barAreaHeight;
              const spentPercent = (item.spent / item.budget) * 100;
              const isHovered = hoveredIndex === idx;

              return (
                <div
                  key={idx}
                  className="flex flex-col items-center gap-2 relative"
                  onMouseEnter={() => setHoveredIndex(idx)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Tooltip */}
                  <AnimatePresence>
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.9 }}
                        transition={{ duration: 0.2 }}
                        className="absolute bottom-full mb-2 z-10 bg-black/90 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 shadow-xl min-w-[180px]"
                        style={{ pointerEvents: "none" }}
                      >
                        <div className="text-white text-sm font-semibold mb-2">
                          {item.label}
                        </div>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Budget:</span>
                            <span className="text-blue-300 font-medium">
                              {item.budget.toLocaleString("cs-CZ")} CZK
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Spent:</span>
                            <span className="text-red-400 font-medium">
                              {item.spent.toLocaleString("cs-CZ")} CZK
                            </span>
                          </div>
                          <div className="flex justify-between items-center pt-1 border-t border-white/10">
                            <span className="text-gray-400">Progress:</span>
                            <span className="text-white font-semibold">
                              {Math.round(spentPercent)}%
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400">Remaining:</span>
                            <span
                              className={`font-medium ${
                                item.budget - item.spent >= 0
                                  ? "text-green-400"
                                  : "text-red-400"
                              }`}
                            >
                              {Math.abs(
                                item.budget - item.spent
                              ).toLocaleString("cs-CZ")}{" "}
                              CZK
                            </span>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Bar */}
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: `${height}px`, opacity: 1 }}
                    transition={{
                      duration: 0.8,
                      delay: idx * 0.1,
                      ease: [0.25, 0.46, 0.45, 0.94],
                    }}
                    whileHover={{ scale: 1.05 }}
                    className="w-16 rounded-xl cursor-pointer relative overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to top, #F58989 60%, #6FA8FF 100%)",
                    }}
                  >
                    {/* Hover effect overlay */}
                    {isHovered && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.2 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 bg-white"
                      />
                    )}
                  </motion.div>
                </div>
              );
            })}
          </div>

          {/* popisky kategorií pod sloupci */}
          <div className="flex justify-around mt-3 text-xs text-gray-400">
            {data.map((item, idx) => (
              <span key={idx}>{item.label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
