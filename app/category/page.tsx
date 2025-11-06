"use client";

import { useEffect } from "react";

export default function CategoryPage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <main className="min-h-screen bg-[#061E34] text-white p-6">
      <h1 className="text-2xl font-semibold">Dočasná stránka Category</h1>
    </main>
  );
}
