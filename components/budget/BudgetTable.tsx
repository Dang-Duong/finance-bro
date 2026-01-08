"use client";

import { useState } from "react";
import BudgetHeader from "./BudgetHeader";
import AddBudgetModal from "./AddBudgetModal";
import LoadingSpinner from "@/components/LoadingSpinner";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";
import { useBudgets } from "@/lib/budgetsContext";
import type { Budget } from "@/lib/budgetsContext";

export default function BudgetTable() {
  const { filteredBudgets, loading, refreshBudgets } = useBudgets();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const totalBudget = filteredBudgets.reduce(
    (acc, budget) => acc + budget.amount,
    0
  );

  const handleAddBudget = () => {
    setEditingBudget(null);
    setIsModalOpen(true);
  };

  const handleEditBudget = (budget: Budget) => {
    setEditingBudget(budget);
    setIsModalOpen(true);
  };

  const handleDeleteBudget = async (budgetId: string) => {
    if (!confirm("Are you sure you want to delete this budget?")) {
      return;
    }

    try {
      const response = await fetch(`/api/budgets/${budgetId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        refreshBudgets();
      } else {
        const result = await response.json();
        alert(result.error || "Failed to delete budget");
      }
    } catch (error) {
      console.error("Error deleting budget:", error);
      alert("Failed to delete budget");
    }
  };

  const handleSubmitBudget = async (data: {
    category: string;
    amount: number;
    month: number;
    year: number;
  }) => {
    try {
      if (editingBudget) {
        const response = await fetch(`/api/budgets/${editingBudget._id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount: data.amount }),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to update budget");
        }
      } else {
        const response = await fetch("/api/budgets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          const result = await response.json();
          throw new Error(result.error || "Failed to create budget");
        }
      }

      setIsModalOpen(false);
      setEditingBudget(null);
      refreshBudgets();
    } catch (error) {
      throw error;
    }
  };

  if (loading) {
    return (
      <div
        className="p-4 sm:p-6 rounded-2xl w-full
          bg-white dark:bg-white/5
          border border-gray-200 dark:border-white/10"
      >
        <BudgetHeader
          total={0}
          onAddBudget={handleAddBudget}
          isEditMode={isEditMode}
          onToggleEdit={() => setIsEditMode(!isEditMode)}
        />
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
        </div>
      </div>
    );
  }

  if (filteredBudgets.length === 0) {
    return (
      <>
        <div
          className="p-4 sm:p-6 rounded-2xl w-full
          bg-white dark:bg-[#0F1C2E]
          border border-gray-200 dark:border-transparent"
        >
          <BudgetHeader
            total={0}
            onAddBudget={handleAddBudget}
            isEditMode={isEditMode}
            onToggleEdit={() => setIsEditMode(!isEditMode)}
          />
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-600 dark:text-gray-400">
              No budgets found for this period
            </div>
          </div>
        </div>
        <AddBudgetModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBudget(null);
          }}
          onSubmit={handleSubmitBudget}
          editingBudget={editingBudget || undefined}
        />
      </>
    );
  }

  return (
    <>
      <div
        className="p-4 sm:p-6 rounded-2xl w-full
          bg-white dark:bg-white/5
          border border-gray-200 dark:border-white/10"
      >
        <BudgetHeader
          total={totalBudget}
          onAddBudget={handleAddBudget}
          isEditMode={isEditMode}
          onToggleEdit={() => setIsEditMode(!isEditMode)}
        />

        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-xs sm:text-sm">
            <thead>
              <tr className="text-left text-gray-600 dark:text-gray-400">
                <th className="pb-3 pr-2 sm:pr-4">Category</th>
                <th className="pb-3 pr-2 sm:pr-4 whitespace-nowrap">Budget</th>
                <th className="pb-3 pr-2 sm:pr-4 whitespace-nowrap">Spent</th>
                <th className="pb-3 pr-2 sm:pr-4 w-16 sm:w-40">Progress</th>
                {isEditMode && <th className="pb-3 w-16 sm:w-20">Actions</th>}
              </tr>
            </thead>

            <tbody>
              {filteredBudgets.map((budget) => {
                const spentPercent = budget.progress;

                return (
                  <tr
                    key={budget._id}
                    className="border-t border-gray-200 dark:border-gray-700"
                  >
                    <td className="py-2 sm:py-3 pr-2 sm:pr-4 text-gray-900 dark:text-white">
                      <div className="flex items-center gap-1 sm:gap-2">
                        <span className="truncate max-w-[80px] sm:max-w-none">
                          {budget.category.name
                            ? budget.category.name.charAt(0).toUpperCase() +
                              budget.category.name.slice(1).toLowerCase()
                            : budget.category.name}
                        </span>
                        {budget.spent > budget.amount && (
                          <span
                            className="text-base sm:text-xl flex-shrink-0"
                            aria-label="Budget exceeded"
                          >
                            😢
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-2 sm:py-3 pr-2 sm:pr-4 text-blue-600 dark:text-blue-300 whitespace-nowrap">
                      <span className="text-[10px] sm:text-xs">
                        {budget.amount.toLocaleString("cs-CZ")}
                      </span>
                      <span className="hidden sm:inline"> CZK</span>
                    </td>

                    <td className="py-2 sm:py-3 pr-2 sm:pr-4 text-red-500 dark:text-red-400 whitespace-nowrap">
                      <span className="text-[10px] sm:text-xs">
                        {budget.spent.toLocaleString("cs-CZ")}
                      </span>
                      <span className="hidden sm:inline"> CZK</span>
                    </td>

                    <td className="py-2 sm:py-3 pr-2 sm:pr-4">
                      <div className="flex items-center gap-1 sm:block">
                        <div className="w-10 sm:w-full bg-gray-200 dark:bg-white rounded-full h-1.5 sm:h-2 flex-shrink-0">
                          <div
                            className={`h-1.5 sm:h-2 rounded-full ${
                              budget.spent > budget.amount
                                ? "bg-red-600"
                                : "bg-blue-600"
                            }`}
                            style={{ width: `${Math.min(spentPercent, 100)}%` }}
                          />
                        </div>
                        <span className="text-[9px] sm:hidden text-gray-500 dark:text-gray-400 ml-1">
                          {Math.round(spentPercent)}%
                        </span>
                      </div>
                    </td>
                    {isEditMode && (
                      <td className="py-2 sm:py-3">
                        <div className="flex items-center gap-1 sm:gap-2">
                          <button
                            onClick={() => handleEditBudget(budget)}
                            className="p-1 sm:p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                            aria-label="Edit budget"
                          >
                            <PencilIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteBudget(budget._id)}
                            className="p-1 sm:p-1.5 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                            aria-label="Delete budget"
                          >
                            <TrashIcon className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <AddBudgetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBudget(null);
        }}
        onSubmit={handleSubmitBudget}
        editingBudget={editingBudget || undefined}
      />
    </>
  );
}
