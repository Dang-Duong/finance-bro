"use client";

import { ChangeEvent } from "react";

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

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* levá část – date, category, type, amount */}
      <div className="flex flex-wrap gap-3">
        {/* DATE */}
        <input
          type="date"
          value={value.date ?? ""}
          onChange={handleField("date")}
          className="h-9 rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 placeholder:text-slate-400"
        />

        {/* CATEGORY */}
        <select
          value={value.category}
          onChange={handleField("category")}
          className="h-9 min-w-[160px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>

        {/* TYPE */}
        <select
          value={value.type}
          onChange={handleField("type")}
          className="h-9 min-w-[130px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600"
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
          className="h-9 w-[120px] rounded-md bg-[#07152c] px-3 text-sm text-slate-100 outline-none ring-1 ring-slate-600 placeholder:text-slate-400"
        />
      </div>

      {/* pravá část – search */}
      <div className="flex-1 min-w-[220px] max-w-lg">
        <input
          type="text"
          placeholder="Search here..."
          value={value.search}
          onChange={handleField("search")}
          className="h-10 w-full rounded-full bg-transparent px-4 text-sm text-slate-100 outline-none ring-1 ring-slate-500 placeholder:text-slate-400"
        />
      </div>
    </div>
  );
};

export default TransactionFilters;
