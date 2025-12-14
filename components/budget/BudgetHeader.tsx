"use client";

interface BudgetHeaderProps {
  total: number;
  onAddBudget?: () => void;
  isEditMode?: boolean;
  onToggleEdit?: () => void;
}

export default function BudgetHeader({
  total,
  onAddBudget,
  isEditMode = false,
  onToggleEdit,
}: BudgetHeaderProps) {
  const formatted = total.toLocaleString("cs-CZ");

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">
        Monthly Budget
      </h1>

      <div className="flex items-center gap-4">
        <div
          className="px-6 py-2 rounded-xl text-lg font-semibold
          bg-gray-100 dark:bg-black/30
          border border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white"
        >
          {formatted} CZK
        </div>

        {onToggleEdit && (
          <button
            onClick={onToggleEdit}
            className={`px-4 py-2 rounded-3xl text-sm text-white transition-colors ${
              isEditMode
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditMode ? "Done" : "Edit"}
          </button>
        )}

        <button
          onClick={onAddBudget}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-3xl text-sm text-white transition-colors"
        >
          Add budget
        </button>
      </div>
    </div>
  );
}
