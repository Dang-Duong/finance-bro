"use client";

import { useState, useEffect } from "react";
import MonthPicker from "./MonthPicker";
import { useBudgets } from "@/lib/budgetsContext";
import { useCategories } from "@/lib/categoriesContext";

export default function BudgetFilters() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const { fetchBudgets, setCategoryFilter } = useBudgets();
  const { categories, loading: categoriesLoading } = useCategories();

  const parseMonthString = (monthString: string | null) => {
    if (!monthString) return null;
    const [yearStr, monthStr] = monthString.split("-");
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;
    return { month, year };
  };

  useEffect(() => {
    const parsed = parseMonthString(selectedMonth);
    if (parsed) {
      fetchBudgets(parsed.month, parsed.year);
    }
  }, [selectedMonth, fetchBudgets]);

  useEffect(() => {
    setCategoryFilter(selectedCategory || null);
  }, [selectedCategory, setCategoryFilter]);

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center">
      <div className="flex flex-col sm:flex-row gap-3">
        <MonthPicker
          value={selectedMonth}
          onChange={setSelectedMonth}
          placeholder="Select month"
        />

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="bg-[#0F1C2E] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
        >
          <option value="">All Categories</option>
          {categoriesLoading ? (
            <option disabled>Loading...</option>
          ) : (
            categories.map((category) => {
              const capitalizeFirst = (str: string) => {
                if (!str) return str;
                return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
              };
              return (
                <option key={category._id} value={category._id}>
                  {capitalizeFirst(category.name)}
                </option>
              );
            })
          )}
        </select>
      </div>
    </div>
  );
}
