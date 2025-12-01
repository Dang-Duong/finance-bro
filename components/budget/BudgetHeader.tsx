"use client";

export default function BudgetHeader({ total }: { total: number }) {
  const formatted = total.toLocaleString("cs-CZ");

  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-2xl font-semibold">Monthly Budget</h1>

      <div className="flex items-center gap-4">
        {/* Total Budget Box */}
        <div className="px-6 py-2 bg-black/30 border border-gray-600 rounded-xl text-lg font-semibold">
          {formatted} CZK
        </div>

        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-3xl text-sm">
          Edit
        </button>

        <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-3xl text-sm">
          Add budget
        </button>
      </div>
    </div>
  );
}
