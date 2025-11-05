"use client";

import type { ReactNode } from "react";
import Navbar from "../components/Navbar";

export default function BudgetLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
