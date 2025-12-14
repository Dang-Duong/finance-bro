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
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
      <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">
        Monthly Budget
      </h1>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-2">
        <div
          className="px-4 sm:px-6 py-2 rounded-xl text-base sm:text-lg font-semibold
          bg-gray-100 dark:bg-black/30
          border border-gray-300 dark:border-gray-600
          text-gray-900 dark:text-white
          text-center sm:text-left"
        >
          {formatted} CZK
        </div>

        <div className="flex gap-2">
          {onToggleEdit && (
            <button
              onClick={onToggleEdit}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-3xl text-sm text-white transition-colors ${
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
            className="flex-1 sm:flex-none px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-3xl text-sm text-white transition-colors whitespace-nowrap"
          >
            Add budget
          </button>
        </div>
      </div>
    </div>
  );
}
