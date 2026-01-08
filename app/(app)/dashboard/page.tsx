"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import AccountBalance from "@/components/dashboard/AccountBalance";
import ExpensesVsIncomes from "@/components/dashboard/ExpensesVsIncomes";
import Transactions from "@/components/dashboard/Transactions";
import SpendByCategory from "@/components/dashboard/SpendByCategory";

export default function Dashboard() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      window.location.href = "/login";
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <main className="min-h-screen bg-navbar-bg p-4 lg:p-6 pt-28 lg:pt-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1 h-full">
            <AccountBalance />
          </div>
          <div className="lg:col-span-2 h-full">
            <ExpensesVsIncomes />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-full">
            <Transactions />
          </div>
          <div className="h-full">
            <SpendByCategory />
          </div>
        </div>
      </div>
    </main>
  );
}
