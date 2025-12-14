"use client";

import { useEffect } from "react";
import { checkAuth } from "@/lib/auth";
import { BudgetsProvider } from "@/lib/budgetsContext";

import BudgetTable from "@/components/budget/BudgetTable";
import BudgetVsSpent from "@/components/budget/BudgetVsSpent";
import BudgetFilters from "@/components/budget/BudgetFilters";

export default function BudgetPage() {
  useEffect(() => {
    const verify = async () => {
      const user = await checkAuth();
      if (!user) window.location.href = "/login";
    };
    verify();
  }, []);

  return (
    <BudgetsProvider>
      <main className="min-h-screen bg-navbar-bg text-white p-4 lg:p-6 pt-28 lg:pt-6">
        {/* Horní řádek: datum + category + search */}
        <BudgetFilters />

        {/* Hlavní obsah: tabulka + graf */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetTable />
          <BudgetVsSpent />
        </div>
      </main>
    </BudgetsProvider>
  );
}
