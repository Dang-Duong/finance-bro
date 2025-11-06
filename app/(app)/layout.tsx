"use client";

import type { ReactNode } from "react";
import Navbar from "../../components/navbar/Navbar";

export default function AppPagesLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Navbar />
      {children}
    </>
  );
}
