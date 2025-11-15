"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useTransactions } from "@/lib/transactionsContext";
import { useCategories } from "@/lib/categoriesContext";
import { cn } from "@/lib/utils";

import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";

const TransactionPage = () => {
  const { transactions, loading, refreshTransactions, addTransaction } =
    useTransactions();
  const { categories } = useCategories();

  // držím to jako `any`, ať se to nehádá s typem z TransactionFilters
  const [filters, setFilters] = useState<any>({
    date: null,        // jeden datumový filtr
    category: "all",
    type: "all",
    amount: "",        // text/číslo do amount filtru
    search: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // jen kvůli stavu tlačítka Edit

  // vytvoření nové transakce (Add modal)
  const handleAddTransaction = async (data: {
    category: string;
    type: "Income" | "Expense";
    amount: number;
    description: string;
    date: Date;
  }) => {
    const payload = {
      amount: data.amount,
      incoming: data.type === "Income",
      description: data.description,
      date: data.date,
      category: data.category,
    };

    const res = await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      console.error("Failed to create transaction");
      return;
    }

    const result = await res.json();

    if (result?.success && result.data) {
      // context si transakci přidá
      addTransaction(result.data);
    } else {
      // fallback – natáhnout znovu
      refreshTransactions();
    }

    setIsAddModalOpen(false);
  };

  // filtrování dat pro tabulku
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // CATEGORY
      if (filters.category && filters.category !== "all") {
        if (t.category !== filters.category) return false;
      }

      // TYPE (Income / Expense)
      if (filters.type === "income" && !t.incoming) return false;
      if (filters.type === "expense" && t.incoming) return false;

      // DATE – pokud je vybraný, bereme přesný den
      if (filters.date) {
        const txDate = new Date(t.date);
        const selected = new Date(filters.date);

        if (
          txDate.getFullYear() !== selected.getFullYear() ||
          txDate.getMonth() !== selected.getMonth() ||
          txDate.getDate() !== selected.getDate()
        ) {
          return false;
        }
      }

      // AMOUNT – jednoduchý filtr na přesnou částku
      if (filters.amount) {
        const target = Number(filters.amount);
        if (!Number.isNaN(target)) {
          if ((t.amount ?? 0) !== target) return false;
        }
      }

      // SEARCH – description + category text
      if (filters.search) {
        const q = String(filters.search).toLowerCase();
        const desc = (t.description || "").toLowerCase();
        const cat =
          (typeof t.category === "string" ? t.category : "").toLowerCase();

        if (!desc.includes(q) && !cat.includes(q)) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <>
      <div className="flex flex-col gap-6 px-8 py-6">
        {/* Title + tlačítka */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-white">Transactions</h1>
            {loading && (
              <p className="mt-1 text-sm text-slate-400">
                Loading transactions…
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            <button
              className="rounded-full bg-sky-500 px-6 py-2 text-sm font-medium text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              Add
            </button>

            <button
              className={cn(
                "rounded-full px-6 py-2 text-sm font-medium",
                isEditing
                  ? "bg-slate-500 text-slate-100"
                  : "bg-slate-700 text-slate-100"
              )}
              onClick={() => setIsEditing((v) => !v)}
            >
              {isEditing ? "Editing..." : "Edit"}
            </button>

            <Link
              href="/category"
              className="rounded-full border border-slate-500 px-6 py-2 text-sm font-medium text-slate-100 hover:bg-slate-700"
            >
              Spend by Category
            </Link>
          </div>
        </div>

        {/* Filtry (datum, category, type, amount, search) */}
        <TransactionFilters
          value={filters}
          onChange={setFilters}
          categories={categories}
        />

        {/* Tabulka přesně jako ve Figmě */}
        <TransactionTable transactions={filteredTransactions} />
      </div>

      {/* Add modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTransaction}
      />
    </>
  );
};

export default TransactionPage;
