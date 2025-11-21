"use client";

import { useMemo, useState } from "react";

import { useTransactions } from "@/lib/transactionsContext";
import { useCategories } from "@/lib/categoriesContext";

import TransactionFilters, {
  TransactionFiltersState,
} from "./TransactionFilters";
import type { TransactionLike } from "./TransactionTable";
import TransactionTable from "./TransactionTable";
import AddTransactionModal from "./AddTransactionModal";
import DeleteTransactionModal from "./DeleteTransactionModal";

const TransactionPage = () => {
  const { transactions, loading, refreshTransactions, addTransaction } =
    useTransactions();
  const { categories } = useCategories();

  const [filters, setFilters] = useState<TransactionFiltersState>({
    date: null, // jeden datumový filtr
    category: "all",
    type: "all",
    amount: null, // text/číslo do amount filtru
    search: "",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // jen kvůli stavu tlačítka Edit
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionLike | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] =
    useState<TransactionLike | null>(null);

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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Failed to update transaction"
        );
      }

      const result = await res.json();
      if (!result?.success) {
        throw new Error(
          result.error || result.message || "Failed to update transaction"
        );
      }

      refreshTransactions();
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
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || errorData.message || "Failed to create transaction"
        );
      }

      const result = await res.json();

      if (!result?.success) {
        throw new Error(
          result.error || result.message || "Failed to create transaction"
        );
      }

      if (result.data) {
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
  const handleEditTransaction = (transaction: TransactionLike) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  // Handle delete transaction - open modal
  const handleDeleteTransaction = (transaction: TransactionLike) => {
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
      if (filters.type !== "all") {
        // Determine if transaction is income - handle null incoming values
        // Check incoming first if it's a boolean, otherwise check type field
        const transaction = t as TransactionLike;
        const isIncome =
          typeof transaction.incoming === "boolean"
            ? transaction.incoming
            : transaction.type === "Income";

        if (filters.type === "income" && !isIncome) return false;
        if (filters.type === "expense" && isIncome) return false;
      }

      // DATE – pokud je vybraný, bereme přesný den
      if (filters.date) {
        // Skip transactions with null/undefined dates
        if (!t.date) {
          return false;
        }

        const txDate = new Date(t.date);
        const selected = new Date(filters.date);

        // Check if dates are valid
        if (
          Number.isNaN(txDate.getTime()) ||
          Number.isNaN(selected.getTime())
        ) {
          return false;
        }

        if (
          txDate.getFullYear() !== selected.getFullYear() ||
          txDate.getMonth() !== selected.getMonth() ||
          txDate.getDate() !== selected.getDate()
        ) {
          return false;
        }
      }

      // AMOUNT – jednoduchý filtr na přesnou částku
      if (filters.amount !== null) {
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
      <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 pt-32 lg:pt-6">
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
        editingTransaction={editingTransaction || undefined}
      />

      {/* Delete confirmation modal */}
      <DeleteTransactionModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingTransaction(null);
        }}
        onConfirm={handleConfirmDelete}
        transactionDescription={deletingTransaction?.description || undefined}
      />
    </>
  );
};

export default TransactionPage;
