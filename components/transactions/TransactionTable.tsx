"use client";

import React from "react";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";

export type TransactionLike = {
  _id?: string;
  id?: string;
  date?: string | Date | null;
  category?: string | { _id: string; name: string } | null;
  incoming?: boolean | null;
  type?: "Income" | "Expense";
  amount?: number | null;
  description?: string | null;
  isRepeating?: boolean;
  frequency?: "weekly" | "monthly" | "yearly";
};

interface TransactionTableProps {
  transactions: TransactionLike[];
  onEdit?: (transaction: TransactionLike) => void;
  onDelete?: (transaction: TransactionLike) => void;
  onAdd?: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

const TransactionTable: React.FC<TransactionTableProps> = ({
  transactions,
  onEdit,
  onDelete,
  onAdd,
  isEditing = false,
  onToggleEdit,
}) => {
  const formatDate = (value?: string | Date | null) => {
    if (!value) return "";
    const d = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getCategoryLabel = (
    value?: string | { _id: string; name: string } | null
  ) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    return value.name ?? "";
  };

  const isIncome = (t: TransactionLike) => {
    if (typeof t.incoming === "boolean") return t.incoming;
    return t.type === "Income";
  };

  return (
    <div
      className="w-full rounded-3xl px-4 lg:px-10 py-4 lg:py-8 shadow-lg border
      bg-white dark:bg-white/5
      border-gray-200 dark:border-white/10"
    >
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-gray-900 dark:text-white">
          Transactions
        </h2>
        <div className="flex items-center gap-2 lg:gap-3">
          {onAdd && (
            <button
              className="rounded-full bg-primary px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              onClick={onAdd}
            >
              Add
            </button>
          )}
          {onToggleEdit && (
            <button
              className={`rounded-full px-4 lg:px-6 py-1.5 lg:py-2 text-xs lg:text-sm font-medium transition-colors ${
                isEditing
                  ? "bg-slate-500 text-white hover:bg-slate-600"
                  : "bg-slate-200 text-gray-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600"
              }`}
              onClick={onToggleEdit}
            >
              {isEditing ? "Editing..." : "Edit"}
            </button>
          )}
        </div>
      </div>

      <div className="lg:hidden space-y-3">
        {transactions.map((t) => {
          const key = t._id ?? t.id ?? `${formatDate(t.date)}-${t.amount}`;
          const income = isIncome(t);
          const amount = t.amount ?? 0;

          return (
            <div
              key={key}
              className="rounded-2xl p-4 space-y-2
                bg-gray-100 dark:bg-white/5"
            >
              <div className="flex items-start gap-2">
                <div className="flex-1">
                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Date
                  </div>
                  <div className="flex items-center gap-2">
                    {isEditing && onDelete && (
                      <button
                        onClick={() => onDelete(t)}
                        className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Delete transaction"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                    <span className="text-sm text-gray-900 dark:text-slate-100">
                      {formatDate(t.date)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200 dark:border-slate-700">
                <div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Category
                  </div>
                  <div className="text-sm text-gray-900 dark:text-slate-100">
                    {getCategoryLabel(t.category)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Type
                  </div>
                  <div className="text-sm text-gray-900 dark:text-slate-100">
                    {income ? "Income" : "Expense"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                  Amount
                </div>
                <div
                  className={`text-base font-semibold ${
                    income ? "text-green-600" : "text-red-500"
                  }`}
                >
                  {amount.toLocaleString("cs-CZ")} CZK
                </div>
              </div>

              {t.description && (
                <div className="pt-2 border-t border-gray-200 dark:border-slate-700">
                  <div className="text-xs text-gray-500 dark:text-slate-400 mb-1">
                    Description
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm text-gray-900 dark:text-slate-100">
                      {t.description}
                    </span>
                    {isEditing && onEdit && (
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Edit transaction"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="py-8 text-center text-sm text-gray-500 dark:text-slate-400">
            No transactions found.
          </div>
        )}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-gray-500 dark:text-slate-400">
              <th className="pb-2 pr-6 font-medium">Date</th>
              <th className="pb-2 pr-6 font-medium">Category</th>
              <th className="pb-2 pr-6 font-medium">Type</th>
              <th className="pb-2 px-6 font-medium border-l border-gray-200 dark:border-slate-700">
                Amount
              </th>
              <th className="pb-2 pl-6 font-medium">Description</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => {
              const key = t._id ?? t.id ?? `${formatDate(t.date)}-${t.amount}`;
              const income = isIncome(t);
              const amount = t.amount ?? 0;

              return (
                <tr key={key}>
                  <td className="py-4 pr-6 rounded-l-2xl bg-gray-100 dark:bg-white/5">
                    <div className="flex items-center gap-2 pl-2">
                      {isEditing && onDelete ? (
                        <button
                          onClick={() => onDelete(t)}
                          className="p-2 text-red-500 hover:text-red-400 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                          aria-label="Delete transaction"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-8 h-8 flex-shrink-0"></div>
                      )}
                      <span className="text-sm text-gray-900 dark:text-slate-100">
                        {formatDate(t.date)}
                      </span>
                    </div>
                  </td>

                  <td className="py-4 pr-6 bg-gray-100 dark:bg-white/5">
                    <span className="text-sm text-gray-900 dark:text-slate-100">
                      {getCategoryLabel(t.category)}
                    </span>
                  </td>

                  <td className="py-4 pr-6 bg-gray-100 dark:bg-white/5">
                    <span className="text-sm text-gray-900 dark:text-slate-100">
                      {income ? "Income" : "Expense"}
                    </span>
                  </td>

                  <td className="py-4 px-6 border-l border-gray-200 dark:border-white/10 bg-gray-100 dark:bg-white/5">
                    <span
                      className={`font-semibold ${
                        income ? "text-green-600" : "text-red-500"
                      }`}
                    >
                      {amount.toLocaleString("cs-CZ")} CZK
                    </span>
                  </td>

                  <td className="py-4 pl-6 rounded-r-2xl bg-gray-100 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-2 pr-2">
                      <span className="text-sm text-gray-900 dark:text-slate-100">
                        {t.description ?? ""}
                      </span>
                      {isEditing && onEdit ? (
                        <button
                          onClick={() => onEdit(t)}
                          className="p-2 text-blue-500 hover:text-blue-400 hover:bg-blue-500/20 rounded-lg transition-colors flex-shrink-0"
                          aria-label="Edit transaction"
                        >
                          <PencilIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-8 h-8 flex-shrink-0"></div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}

            {transactions.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-8 text-center text-sm text-gray-500 dark:text-slate-400"
                >
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
