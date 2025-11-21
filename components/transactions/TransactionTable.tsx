"use client";

import React from "react";
import PencilIcon from "@/components/icons/PencilIcon";
import TrashIcon from "@/components/icons/TrashIcon";

export type TransactionLike = {
  _id?: string;
  id?: string;
  date?: string | Date | null;
  category?: string | { _id: string; name: string } | null;
  incoming?: boolean | null; // true = Income, false = Expense
  type?: "Income" | "Expense"; // fallback, kdyby nepřišlo `incoming`
  amount?: number | null;
  description?: string | null;
};

interface TransactionTableProps {
  transactions: TransactionLike[];
  onEdit?: (transaction: TransactionLike) => void;
  onDelete?: (transaction: TransactionLike) => void;
  onAdd?: () => void;
  isEditing?: boolean;
  onToggleEdit?: () => void;
}

/**
 * Tabulka transakcí – vzhled co nejblíž Figmě:
 * - 1 řádek = 1 transakce
 * - sloupce Date / Category / Type / Amount / Description
 * - vertikální čára před sloupcem Amount
 * - částky: zelená pro Income, červená pro Expense, „CZK“ malým textem
 */
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
    <div className="w-full rounded-3xl bg-[#071426] px-4 lg:px-10 py-4 lg:py-8 shadow-lg border border-slate-800">
      {/* Hlavička tabulky */}
      <div className="flex items-center justify-between mb-4 lg:mb-6">
        <h2 className="text-base lg:text-lg font-semibold text-white">
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
                  ? "bg-slate-500 text-slate-100 hover:bg-slate-600"
                  : "bg-slate-700 text-slate-100 hover:bg-slate-600"
              }`}
              onClick={onToggleEdit}
            >
              {isEditing ? "Editing..." : "Edit"}
            </button>
          )}
        </div>
      </div>

      {/* Mobile: Card Layout */}
      <div className="lg:hidden space-y-3">
        {transactions.map((t) => {
          const key = t._id ?? t.id ?? `${formatDate(t.date)}-${t.amount}`;
          const income = isIncome(t);
          const amount = t.amount ?? 0;

          return (
            <div
              key={key}
              className="rounded-2xl bg-[#07192c] shadow-sm p-4 space-y-2"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">Date</div>
                  <div className="text-sm text-slate-100">
                    {formatDate(t.date)}
                  </div>
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2">
                    {onEdit && (
                      <button
                        onClick={() => onEdit(t)}
                        className="p-2 text-primary hover:text-primary-hover hover:bg-primary/20 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Edit transaction"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => onDelete(t)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                        aria-label="Delete transaction"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-700">
                <div>
                  <div className="text-xs text-slate-400 mb-1">Category</div>
                  <div className="text-sm text-slate-100">
                    {getCategoryLabel(t.category)}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-slate-400 mb-1">Type</div>
                  <div className="text-sm text-slate-100">
                    {income ? "Income" : "Expense"}
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-700">
                <div className="text-xs text-slate-400 mb-1">Amount</div>
                <div
                  className={`text-base font-semibold ${
                    income ? "text-[#32D26E]" : "text-[#FF4D4D]"
                  }`}
                >
                  {amount.toLocaleString("cs-CZ")} CZK
                </div>
              </div>

              {t.description && (
                <div className="pt-2 border-t border-slate-700">
                  <div className="text-xs text-slate-400 mb-1">Description</div>
                  <div className="text-sm text-slate-100">{t.description}</div>
                </div>
              )}
            </div>
          );
        })}

        {transactions.length === 0 && (
          <div className="py-8 text-center text-sm text-slate-400">
            No transactions found.
          </div>
        )}
      </div>

      {/* Desktop: Table Layout */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-sm text-left text-slate-100 border-separate border-spacing-y-3">
          <thead>
            <tr className="text-xs uppercase tracking-wide text-slate-400">
              <th className="pb-2 pr-6 font-medium">Date</th>
              <th className="pb-2 pr-6 font-medium">Category</th>
              <th className="pb-2 pr-6 font-medium">Type</th>
              <th className="pb-2 px-6 font-medium border-l border-slate-700">
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
                <tr key={key} className="align-middle">
                  {/* Date */}
                  <td className="py-4 pr-6 rounded-l-2xl bg-[#07192c] shadow-sm">
                    <div className="flex items-center gap-2 pl-2">
                      {isEditing && onDelete ? (
                        <button
                          onClick={() => onDelete(t)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-colors flex-shrink-0"
                          aria-label="Delete transaction"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      ) : (
                        <div className="w-8 h-8 flex-shrink-0"></div>
                      )}
                      <span className="text-sm text-slate-100">
                        {formatDate(t.date)}
                      </span>
                    </div>
                  </td>

                  {/* Category */}
                  <td className="py-4 pr-6 bg-[#07192c] shadow-sm">
                    <span className="text-sm text-slate-100">
                      {getCategoryLabel(t.category)}
                    </span>
                  </td>

                  {/* Type */}
                  <td className="py-4 pr-6 bg-[#07192c] shadow-sm">
                    <span className="text-sm text-slate-100">
                      {income ? "Income" : "Expense"}
                    </span>
                  </td>

                  {/* Amount – s vertikální čárou vlevo + barva částky */}
                  <td className="py-4 px-6 border-l border-slate-700 bg-[#07192c] shadow-sm">
                    <span
                      className={`font-semibold ${
                        income ? "text-[#32D26E]" : "text-[#FF4D4D]"
                      }`}
                    >
                      {amount.toLocaleString("cs-CZ")} CZK
                    </span>
                  </td>

                  {/* Description */}
                  <td className="py-4 pl-6 rounded-r-2xl bg-[#07192c] shadow-sm">
                    <div className="flex items-center justify-between gap-2 pr-2">
                      <span className="text-sm text-slate-100">
                        {t.description ?? ""}
                      </span>
                      {isEditing && onEdit ? (
                        <button
                          onClick={() => onEdit(t)}
                          className="p-2 text-primary hover:text-primary-hover hover:bg-primary/20 rounded-lg transition-colors flex-shrink-0"
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
                  className="py-8 text-center text-sm text-slate-400"
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
