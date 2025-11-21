"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

import { useTransactions } from "@/lib/transactionsContext";
import { useCategories } from "@/lib/categoriesContext";

import TransactionFilters from "./TransactionFilters";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

const TransactionPage = () => {
  const { transactions, loading, refreshTransactions, addTransaction } =
    useTransactions();
  const { categories } = useCategories();

  // držím to jako `any`, ať se to nehádá s typem z TransactionFilters
  const [filters, setFilters] = useState<any>({
    date: null, // jeden datumový filtr
    category: "all",
    type: "all",
    amount: "", // text/číslo do amount filtru
    search: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // jen kvůli stavu tlačítka Edit
  const [editingTransaction, setEditingTransaction] = useState<any>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] = useState<any>(null);

  // vytvoření nové transakce nebo update (Add/Edit modal)
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

    if (editingTransaction) {
      // Update existing transaction
      const res = await fetch(
        `/api/transactions/${editingTransaction._id || editingTransaction.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) {
        console.error("Failed to update transaction");
        return;
      }

      const result = await res.json();
      if (result?.success) {
        refreshTransactions();
      }
      setEditingTransaction(null);
      setIsAddModalOpen(false);
    } else {
      // Create new transaction
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
    }
  };

  // Handle edit transaction
  const handleEditTransaction = (transaction: any) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  // Handle delete transaction - open modal
  const handleDeleteTransaction = (transaction: any) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete transaction
  const handleConfirmDelete = async () => {
    if (!deletingTransaction) return;

    const transactionId =
      deletingTransaction._id || deletingTransaction.id || "";

    try {
      const res = await fetch(`/api/transactions/${transactionId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        refreshTransactions();
      } else {
        console.error("Failed to delete transaction");
      }
    } catch (error) {
      console.error("Error deleting transaction:", error);
    } finally {
      setIsDeleteModalOpen(false);
      setDeletingTransaction(null);
    }
  };

  // filtrování dat pro tabulku
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      // CATEGORY
      if (filters.category && filters.category !== "all") {
        const categoryName =
          typeof t.category === "string" ? t.category : t.category?.name || "";
        if (
          categoryName.trim().toLowerCase() !==
          filters.category.trim().toLowerCase()
        ) {
          return false;
        }
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
          typeof t.category === "string" ? t.category : t.category?.name || "";
        const catLower = cat.toLowerCase();

        if (!desc.includes(q) && !catLower.includes(q)) return false;
      }

      return true;
    });
  }, [transactions, filters]);

  return (
    <>
      <div className="flex flex-col gap-6 px-8 py-6">
        {/* Title */}
        <div>
          <h1 className="text-xl font-semibold text-white">Transactions</h1>
          {loading && (
            <p className="mt-1 text-sm text-slate-400">Loading transactions…</p>
          )}
        </div>

        {/* Filtry (datum, category, type, amount, search) */}
        <TransactionFilters
          value={filters}
          onChange={setFilters}
          categories={categories}
        />

        {/* Tabulka přesně jako ve Figmě */}
        <TransactionTable
          transactions={filteredTransactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAdd={() => {
            setEditingTransaction(null);
            setIsAddModalOpen(true);
          }}
          isEditing={isEditing}
          onToggleEdit={() => setIsEditing((v) => !v)}
        />
      </div>

      {/* Add/Edit modal */}
      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleAddTransaction}
        editingTransaction={editingTransaction}
      />

      {/* Delete confirmation modal */}
      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        transactionDescription={deletingTransaction?.description}
      />
    </>
  );
};

export default TransactionPage;
