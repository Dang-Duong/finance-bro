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
import LoadingSpinner from "@/components/LoadingSpinner";

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
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (transactions.length > 0 || !loading) {
      calculateChartData();
    }
  }, [transactions, selectedPeriod]);

  const calculateChartData = () => {
    const now = new Date();
    const data: Record<
      string,
      { expenses: number; incomes: number; label: string }
    > = {};

    if (selectedPeriod === "Week") {
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = date.toISOString().slice(0, 10);
        const label = date.toLocaleDateString("en-US", { weekday: "short" });
        data[key] = { expenses: 0, incomes: 0, label };
      }

      transactions.forEach((t) => {
        const key = new Date(t.date).toISOString().slice(0, 10);
        if (data[key]) {
          if (t.incoming) {
            data[key].incomes += t.amount;
          } else {
            data[key].expenses += t.amount;
          }
        }
      });
    }

    if (selectedPeriod === "Month") {
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${date.getFullYear()}-${date.getMonth()}`;
        data[key] = {
          expenses: 0,
          incomes: 0,
          label: monthNames[date.getMonth()],
        };
      }

      transactions.forEach((t) => {
        const d = new Date(t.date);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (data[key]) {
          if (t.incoming) {
            data[key].incomes += t.amount;
          } else {
            data[key].expenses += t.amount;
          }
        }
      });
    }

    if (selectedPeriod === "Year") {
      for (let i = 4; i >= 0; i--) {
        const year = now.getFullYear() - i;
        data[year] = {
          expenses: 0,
          incomes: 0,
          label: year.toString(),
        };
      }

      transactions.forEach((t) => {
        const y = new Date(t.date).getFullYear();
        if (data[y]) {
          if (t.incoming) {
            data[y].incomes += t.amount;
          } else {
            data[y].expenses += t.amount;
          }
        }
      });
    }

    setChartData(
      Object.values(data).map((d) => ({
        month: d.label,
        expenses: d.expenses,
        incomes: d.incomes,
        net: d.incomes - d.expenses,
      }))
    );
  };

  const periodTotal = chartData.reduce((s, i) => s + i.net, 0);

  const gridColor = isDark ? "#ffffff20" : "#00000020";
  const axisColor = isDark ? "#ffffff60" : "#374151";
  const legendColor = isDark ? "#ffffff80" : "#374151";
  const tooltipBg = isDark ? "rgba(0,0,0,0.85)" : "#ffffff";
  const tooltipBorder = isDark ? "rgba(255,255,255,0.2)" : "#e5e7eb";
  const tooltipText = isDark ? "#ffffff" : "#111827";

  if (loading) {
    return (
      <motion.div className="rounded-lg p-6 border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 lg:col-span-2">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
          Expenses vs Incomes
        </h2>
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner size="md" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="rounded-lg p-6 border bg-white dark:bg-white/5 border-gray-200 dark:border-white/10 lg:col-span-2">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
          Expenses vs Incomes
        </h2>

        <div className="flex gap-2">
          {["Week", "Month", "Year"].map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPeriod(p)}
              className={`px-4 py-1 text-sm rounded transition-colors
                ${
                  selectedPeriod === p
                    ? "bg-gray-200 dark:bg-white/20 text-gray-900 dark:text-white"
                    : "bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white/80"
                }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className={periodTotal >= 0 ? "text-green-500" : "text-red-500"}>
          {periodTotal >= 0 ? "↑" : "↓"}
        </span>
        <span className="font-semibold text-gray-900 dark:text-white">
          {periodTotal >= 0 ? "+" : ""}
          {Math.abs(periodTotal).toLocaleString("en-US")} CZK
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="grid grid-cols-2 gap-2">
          {chartData.map((item) => (
            <div
              key={item.month}
              className="flex justify-between p-2 rounded bg-gray-100 dark:bg-white/5"
            >
              <span className="text-sm text-gray-700 dark:text-white/80">
                {item.month}
              </span>
              <span
                className={item.net >= 0 ? "text-green-500" : "text-red-500"}
              >
                {item.net >= 0 ? "+" : ""}
                {item.net.toLocaleString("en-US")} CZK
              </span>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey="month" stroke={axisColor} />
              <YAxis stroke={axisColor} />
              <Tooltip
                contentStyle={{
                  backgroundColor: tooltipBg,
                  border: `1px solid ${tooltipBorder}`,
                  color: tooltipText,
                }}
              />
              <Legend wrapperStyle={{ color: legendColor }} />
              <Bar dataKey="expenses" fill="#ef4444" />
              <Bar dataKey="incomes" fill="#22c55e" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </motion.div>
  );
}
