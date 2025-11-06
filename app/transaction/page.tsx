"use client";

import { useEffect } from "react";
import Navbar from "../components/Navbar";

export default function TransactionPage() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/auth";
    }
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#061E34] text-white p-6">
        <h1 className="text-2xl font-semibold">Dočasná stránka Transaction</h1>
      </main>
    </>
  );
}
