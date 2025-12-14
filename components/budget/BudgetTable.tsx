"use client";

import BudgetHeader from "./BudgetHeader";

export default function BudgetTable() {
  const items = [
    { category: "Food", budget: 5000, spent: 4000 },
    { category: "Housing", budget: 10000, spent: 6000 },
    { category: "Transport", budget: 5000, spent: 3500 },
    { category: "Subscription", budget: 1500, spent: 1500 },
  ];

  const totalBudget = items.reduce((acc, x) => acc + x.budget, 0);

  return (
    <div
      className="p-6 rounded-2xl w-full
        bg-white dark:bg-[#0F1C2E]
        border border-gray-200 dark:border-transparent"
    >
      <BudgetHeader total={totalBudget} />

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-600 dark:text-gray-400">
            <th className="pb-3">Category</th>
            <th className="pb-3">Budget</th>
            <th className="pb-3">Spent</th>
            <th className="pb-3 w-40">Progress</th>
          </tr>
        </thead>

        <tbody>
          {items.map((row, index) => {
            const spentPercent = (row.spent / row.budget) * 100;

            return (
              <tr
                key={index}
                className="border-t border-gray-200 dark:border-gray-700"
              >
                <td className="py-3 text-gray-900 dark:text-white">
                  {row.category}
                </td>

                <td className="text-blue-600 dark:text-blue-300">
                  {row.budget} CZK
                </td>

                <td className="text-red-500 dark:text-red-400">
                  {row.spent} CZK
                </td>

                <td>
                  <div className="w-full bg-gray-200 dark:bg-white rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${spentPercent}%` }}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
