"use client";

import { useEffect, useState } from "react";
import AccountBalance from "@/components/dashboard/AccountBalance";
import ExpensesVsIncomes from "@/components/dashboard/ExpensesVsIncomes";
import Transactions from "@/components/dashboard/Transactions";
import SpendByCategory from "@/components/dashboard/SpendByCategory";

type User = {
  username: string;
  // add other user fields as needed
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      // není přihlášen → redirect na login
      window.location.href = "/login";
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <p className="p-6 text-white">Načítám...</p>;

  return (
    <main className="min-h-screen bg-primary-dark p-6">
      <div className="mx-auto max-w-7xl">
        {/* Top Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-1">
            <AccountBalance />
          </div>
          <div className="lg:col-span-2">
            <ExpensesVsIncomes />
          </div>
        </div>

        {/* Bottom Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <Transactions />
          </div>
          <div>
            <SpendByCategory />
          </div>
        </div>
      </div>
    </main>
  );
}
