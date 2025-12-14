"use client";

import { useMemo, useState, useEffect } from "react";

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
    startDate: null,
    endDate: null,
    category: "all",
    type: "all",
    amount: null,
    search: "",
    recurring: "all",
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionLike | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTransaction, setDeletingTransaction] =
    useState<TransactionLike | null>(null);

  const handleAddTransaction = async (data: {
    category: string;
    type: "Income" | "Expense";
    amount: number;
    description: string;
    date: Date;
    isRepeating?: boolean;
    frequency?: "weekly" | "monthly" | "yearly";
  }) => {
    const payload = {
      amount: data.amount,
      incoming: data.type === "Income",
      description: data.description,
      date: data.date,
      category: data.category,
      isRepeating: data.isRepeating,
      frequency: data.frequency,
    };

    if (editingTransaction) {
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
        addTransaction(result.data);
      } else {
        refreshTransactions();
      }

      setIsAddModalOpen(false);
    }
  };

  const handleEditTransaction = (transaction: TransactionLike) => {
    setEditingTransaction(transaction);
    setIsAddModalOpen(true);
  };

  const handleDeleteTransaction = (transaction: TransactionLike) => {
    setDeletingTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

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

  // Auto-generate recurring transactions on page load
  useEffect(() => {
    const generateRecurring = async () => {
      try {
        const res = await fetch("/api/transactions/recurring/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.count > 0) {
            refreshTransactions();
          }
        }
      } catch (error) {
        console.error("Error generating recurring transactions:", error);
      }
    };

    generateRecurring();
  }, [refreshTransactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
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

      if (filters.type !== "all") {
        const transaction = t as TransactionLike;
        const isIncome =
          typeof transaction.incoming === "boolean"
            ? transaction.incoming
            : transaction.type === "Income";

        if (filters.type === "income" && !isIncome) return false;
        if (filters.type === "expense" && isIncome) return false;
      }

      if (filters.recurring !== "all") {
        const transaction = t as TransactionLike;
        const isRecurring = transaction.isRepeating === true;

        if (filters.recurring === "recurring" && !isRecurring) return false;
        if (filters.recurring === "non-recurring" && isRecurring) return false;
      }

      if (filters.startDate || filters.endDate) {
        if (!t.date) {
          return false;
        }

        const txDate = new Date(t.date);
        txDate.setHours(0, 0, 0, 0);

        if (Number.isNaN(txDate.getTime())) {
          return false;
        }

        if (filters.startDate) {
          const startDate = new Date(filters.startDate);
          startDate.setHours(0, 0, 0, 0);
          if (txDate < startDate) {
            return false;
          }
        }

        if (filters.endDate) {
          const endDate = new Date(filters.endDate);
          endDate.setHours(23, 59, 59, 999);
          if (txDate > endDate) {
            return false;
          }
        }
      }

      if (filters.amount !== null) {
        const target = Number(filters.amount);
        if (!Number.isNaN(target)) {
          if ((t.amount ?? 0) !== target) return false;
        }
      }

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
      <main className="min-h-screen bg-navbar-bg text-white">
        <div className="flex flex-col gap-6 px-4 lg:px-8 py-6 pt-32 lg:pt-6">
          <div>
            <h1 className="text-xl font-semibold text-white">Transactions</h1>
            {loading && (
              <p className="mt-1 text-sm text-slate-400">
                Loading transactions…
              </p>
            )}
          </div>

          <TransactionFilters
            value={filters}
            onChange={setFilters}
            categories={categories}
          />

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
      </main>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleAddTransaction}
        editingTransaction={editingTransaction || undefined}
      />

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
