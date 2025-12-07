"use client";

import { useEffect } from "react";
import { checkAuth } from "@/lib/auth";

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
    <main className="min-h-screen bg-navbar-bg text-white p-6">
      {/* Horní řádek: datum + category + search */}
      <BudgetFilters />

      {/* Hlavní obsah: tabulka + graf */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetTable />
        <BudgetVsSpent />
      </div>
    </main>
  );
}
