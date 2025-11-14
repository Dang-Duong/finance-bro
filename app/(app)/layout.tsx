"use client";

import type { ReactNode } from "react";
import Navbar from "../../components/navbar/Navbar";
import { AppProvider } from "@/lib/appContext";

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  return (
    <AppProvider>
      <Navbar />
      {children}
    </AppProvider>
  );
}
