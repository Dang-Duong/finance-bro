"use client";

import { ChangeEvent } from "react";
import DatePicker from "./DatePicker";

export type TransactionFiltersState = {
  date: string | null;
  category: string;
  type: "all" | "income" | "expense";
  amount: number | null;
  search: string;
};

export type Category = {
  _id: string;
  name: string;
};

type Props = {
  value: TransactionFiltersState;
  onChange: (next: TransactionFiltersState) => void;
  categories: Category[];
};

const TransactionFilters: React.FC<Props> = ({
  value,
  onChange,
  categories,
}) => {
  const handleField =
    (field: keyof TransactionFiltersState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      let v: any = e.target.value;

      if (field === "date") {
        v = v || null;
      }

      if (field === "amount") {
        v = e.target.value === "" ? null : Number(e.target.value);
      }

      onChange({
        ...value,
        [field]: v,
      });
    };

  const handleDateChange = (date: string | null) => {
    onChange({
      ...value,
      date,
    });
  };

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* levá část – date, category, type, amount */}
      <div className="flex flex-wrap gap-3">
        {/* DATE */}
        <DatePicker
          value={value.date}
          onChange={handleDateChange}
          placeholder="Select date"
        />

        {/* CATEGORY */}
        <select
          value={value.category}
          onChange={handleField("category")}
          className="h-9 min-w-[160px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 hover:ring-slate-500 focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="all">All categories</option>
          {categories.map((c) => {
            // Capitalize category name to match transaction normalization
            const capitalizeFirst = (str: string) => {
              if (!str) return str;
              return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
            };
            const categoryName = capitalizeFirst(c.name);
            return (
              <option key={c._id} value={categoryName}>
                {categoryName}
              </option>
            );
          })}
        </select>

        {/* TYPE */}
        <select
          value={value.type}
          onChange={handleField("type")}
          className="h-9 min-w-[130px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 hover:ring-slate-500 focus:ring-2 focus:ring-primary transition-all"
        >
          <option value="all">All types</option>
          <option value="income">Income</option>
          <option value="expense">Expense</option>
        </select>

        {/* AMOUNT */}
        <input
          type="number"
          placeholder="amount..."
          value={value.amount ?? ""}
          onChange={handleField("amount")}
          className="h-9 w-[120px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 hover:ring-slate-500 focus:ring-2 focus:ring-primary placeholder:text-slate-400 transition-all"
        />
      </div>

      {/* pravá část – search */}
      <div className="flex-1 min-w-[220px] max-w-lg">
        <input
          type="text"
          placeholder="Search here..."
          value={value.search}
          onChange={handleField("search")}
          className="h-10 w-full rounded-full bg-transparent px-4 text-sm text-slate-100 outline-none ring-1 ring-slate-500 hover:ring-slate-400 focus:ring-2 focus:ring-primary placeholder:text-slate-400 transition-all"
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
