"use client";

import { motion } from "framer-motion";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";

const COLORS = {
  card: "#22c55e", // green
  cash: "#3b82f6", // light blue
  investment: "#f97316", // orange
  saving: "#16a34a", // dark green
};

const mockData = [
  { name: "Card", value: 519273, color: COLORS.card },
  { name: "Cash", value: 5000, color: COLORS.cash },
  { name: "Investment", value: 222374, color: COLORS.investment },
  { name: "Saving", value: 296898, color: COLORS.saving },
];

const totalBalance = mockData.reduce((sum, item) => sum + item.value, 0);

export default function AccountBalance() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">Account Balance</h2>

      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-3xl font-bold mb-4 text-white"
      >
        {totalBalance.toLocaleString("cs-CZ")} CZK
      </motion.div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        {mockData.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-sm text-white/80">
              {item.name} ≈ {item.value.toLocaleString("cs-CZ")} CZK
            </span>
          </motion.div>
        ))}
      </div>

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
            >
              {mockData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Legend wrapperStyle={{ display: "none" }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="text-center"
          >
            <div className="text-green-500 text-2xl mb-1">↑</div>
            <div className="text-white text-sm font-semibold">+ 10,594 CZK</div>
            <div className="text-white/60 text-xs">this month</div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
