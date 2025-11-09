"use client";

import type { ReactNode } from "react";
import Navbar from "../../components/navbar/Navbar";
import { TransactionsProvider } from "@/lib/transactionsContext";

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  return (
    <TransactionsProvider>
      <Navbar />
      {children}
    </TransactionsProvider>
  );
}
