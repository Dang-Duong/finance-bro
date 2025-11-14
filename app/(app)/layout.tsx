"use client";

import type { ReactNode } from "react";
import Navbar from "../../components/navbar/Navbar";
import { TransactionsProvider } from "@/lib/transactionsContext";
import { CategoriesProvider } from "@/lib/categoriesContext";

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  return (
    <TransactionsProvider>
      <CategoriesProvider>
        <Navbar />
        {children}
      </CategoriesProvider>
    </TransactionsProvider>
  );
}
