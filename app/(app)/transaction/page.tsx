"use client";

import { useEffect } from "react";
import { checkAuth } from "@/lib/auth"; 
import TransactionScreen from "@/components/transactions/TransactionPage"; 

export default function TransactionRoutePage() {
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) {
        window.location.href = "/login";
      }
    };
    verifyAuth();
  }, []);

  return <TransactionScreen />;
}
