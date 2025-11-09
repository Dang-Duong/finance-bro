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

type MonthData = {
  month: string;
  expenses: number;
  incomes: number;
  net: number;
};

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default function ExpensesVsIncomes() {
  const [selectedPeriod, setSelectedPeriod] = useState("Month");
  const { transactions, loading } = useTransactions();
  const [chartData, setChartData] = useState<MonthData[]>([]);

  useEffect(() => {
    if (transactions.length > 0 || !loading) {
      calculateChartData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactions, selectedPeriod]);

  const calculateChartData = () => {
    const now = new Date();
    const data: { [key: string]: { expenses: number; incomes: number } } = {};

    // Initialize last 12 months
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      data[key] = { expenses: 0, incomes: 0 };
    }

    // Process transactions
    transactions.forEach((transaction) => {
      const transactionDate = new Date(transaction.date);
      const key = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, "0")}`;

      if (data[key]) {
        if (transaction.incoming) {
          data[key].incomes += transaction.amount;
        } else {
          data[key].expenses += transaction.amount;
        }
      }
    });

    // Convert to chart data format
    const chartDataArray: MonthData[] = Object.keys(data)
      .map((key) => {
        const [year, month] = key.split("-");
        const monthIndex = parseInt(month) - 1;
        return {
          month: monthNames[monthIndex],
          expenses: data[key].expenses,
          incomes: data[key].incomes,
          net: data[key].incomes - data[key].expenses,
        };
      })
      .slice(-12); // Last 12 months

    setChartData(chartDataArray);
  };

  const yearlyTotal = chartData.reduce((sum, item) => sum + item.net, 0);
  const maxValue = Math.max(
    ...chartData.map((d) => Math.max(d.expenses, d.incomes)),
    10000
  );

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="bg-white/5 rounded-lg p-6 border border-white/10 lg:col-span-2"
      >
        <h2 className="text-xl font-semibold mb-4 text-white">
          Expenses vs Incomes
        </h2>
        <div className="text-white/60">Loading...</div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-white/5 rounded-lg p-6 border border-white/10 lg:col-span-2"
    >
      <h2 className="text-xl font-semibold mb-4 text-white">
        Expenses vs Incomes
      </h2>

      {/* Yearly Summary */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex items-center gap-2 mb-6"
      >
        <span
          className={`text-xl ${yearlyTotal >= 0 ? "text-green-500" : "text-red-500"}`}
        >
          {yearlyTotal >= 0 ? "↑" : "↓"}
        </span>
        <span className="text-white font-semibold">
          {yearlyTotal >= 0 ? "+" : ""}
          {Math.abs(yearlyTotal).toLocaleString("en-US")} CZK this year
        </span>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left: Monthly Summary Table */}
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-white">
            Expenses vs Incomes
          </h2>

          <div className="grid grid-cols-2 gap-2">
            {chartData.length > 0 ? (
              chartData.map((item, index) => {
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
                    {item.net.toLocaleString("en-US")} CZK
                  </span>
                </motion.div>
              );
              })
            ) : (
              <div className="col-span-2 text-white/60 text-center py-4">
                No transaction data
              </div>
            )}
          </div>
        </div>

        {/* Right: Chart */}
        <div className="flex flex-col">
          <div className="flex items-center gap-4 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-white/80">Expenses</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500" />
              <span className="text-sm text-white/80">Incomes</span>
            </div>
          </div>

          <div className="text-sm text-white/60 mb-2">
            {chartData.length > 0
              ? `${chartData[0].month} ${new Date().getFullYear() - 1} - ${chartData[chartData.length - 1].month} ${new Date().getFullYear()}`
              : "No data"}
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
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff20" />
                  <XAxis
                    dataKey="month"
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
            ) : (
              <div className="flex items-center justify-center h-full text-white/60">
                No transaction data
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
