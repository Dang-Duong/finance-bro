"use client";

import { useEffect } from "react";

export default function SavingsPage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return (
    <main className="min-h-screen bg-navbar-bg text-white p-6">
      <h1 className="text-2xl font-semibold">Dočasná stránka Savings</h1>
    </main>
  );
}
