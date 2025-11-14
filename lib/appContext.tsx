"use client";

import type { ReactNode } from "react";
import { TransactionsProvider } from "./transactionsContext";
import { CategoriesProvider } from "./categoriesContext";

export function AppProvider({ children }: { children: ReactNode }) {
  return (
    <TransactionsProvider>
      <CategoriesProvider>{children}</CategoriesProvider>
    </TransactionsProvider>
  );
}
