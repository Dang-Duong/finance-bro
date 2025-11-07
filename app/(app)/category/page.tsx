"use client";

import { useEffect } from "react";
import { checkAuth } from "@/lib/auth";

export default function CategoryPage() {
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) {
        window.location.href = "/login";
      }
    };
    verifyAuth();
  }, []);

  return (
    <main className="min-h-screen bg-navbar-bg text-white p-6">
      <h1 className="text-2xl font-semibold">Dočasná stránka Category</h1>
    </main>
  );
}
