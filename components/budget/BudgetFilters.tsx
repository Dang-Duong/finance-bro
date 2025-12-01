"use client";

import { useState } from "react";
import MonthPicker from "./MonthPicker";

export default function BudgetFilters() {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
    <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      {/* Levá část – datum + category */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Month Picker */}
        <MonthPicker
          value={selectedMonth}
          onChange={setSelectedMonth}
          placeholder="Select month"
        />

        {/* Category */}
        <select
          className="bg-[#0F1C2E] border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:outline-none"
          defaultValue=""
        >
          <option value="" disabled>
            Category...
          </option>
          <option value="food">Food</option>
          <option value="housing">Housing</option>
          <option value="transport">Transport</option>
          <option value="subscription">Subscription</option>
        </select>
      </div>

      {/* Pravá část – Search here... */}
      <div className="w-full lg:w-auto">
        <div className="flex items-center justify-end">
          <div className="flex items-center w-full max-w-sm bg-transparent">
            <input
              type="text"
              placeholder="Search here..."
              className="w-full bg-transparent border border-gray-500 rounded-full px-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
