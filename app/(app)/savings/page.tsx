"use client";

import { useEffect, useState } from "react";
import { checkAuth } from "@/lib/auth";
import {
  SavingsContent,
  type SavingGoal,
  type SavingDeposit,
} from "@/components/savings/SavingsContent";

export default function SavingsPage() {
  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) {
        window.location.href = "/login";
      }
    };
    verifyAuth();
  }, []);

  const [goals, setGoals] = useState<SavingGoal[]>([
    {
      id: "emergency",
      name: "Emergency found",
      goalAmount: 200_000,
      currentAmount: 120_000,
    },
    {
      id: "vacation",
      name: "Vacation",
      goalAmount: 50_000,
      currentAmount: 15_000,
    },
    {
      id: "car",
      name: "New car",
      goalAmount: 400_000,
      currentAmount: 35_000,
    },
  ]);

  const [deposits, setDeposits] = useState<SavingDeposit[]>([
    {
      id: "1",
      date: "2024-08-23",
      amount: 50_987,
      goalId: "emergency",
    },
    {
      id: "2",
      date: "2024-10-17",
      amount: 10_987,
      goalId: "emergency",
    },
    {
      id: "3",
      date: "2024-10-30",
      amount: 987,
      goalId: "car",
    },
    {
      id: "4",
      date: "2024-11-23",
      amount: 5_987,
      goalId: "vacation",
    },
  ]);

  // DEMO: Add – přidá 1000 CZK na Emergency, jen aby bylo vidět, že UI reaguje
  const handleAddDeposit = () => {
    const newDeposit: SavingDeposit = {
      id: String(Date.now()) + Math.random().toString(16).slice(2),
      date: new Date().toISOString().slice(0, 10),
      amount: 1_000,
      goalId: "emergency",
    };

    setDeposits((prev) => [...prev, newDeposit]);

    setGoals((prev) =>
      prev.map((g) =>
        g.id === newDeposit.goalId
          ? { ...g, currentAmount: g.currentAmount + newDeposit.amount }
          : g
      )
    );
  };

  const handleDeleteDeposit = (id: string) => {
    setDeposits((prev) => {
      const toDelete = prev.find((d) => d.id === id);
      if (!toDelete) return prev;

      setGoals((goalsPrev) =>
        goalsPrev.map((g) =>
          g.id === toDelete.goalId
            ? { ...g, currentAmount: g.currentAmount - toDelete.amount }
            : g
        )
      );

      return prev.filter((d) => d.id !== id);
    });
  };

  return (
    <main className="min-h-screen bg-navbar-bg text-white px-4 py-6 md:px-8">
      <SavingsContent
        goals={goals}
        deposits={deposits}
        onAddDeposit={handleAddDeposit}
        onDeleteDeposit={handleDeleteDeposit}
      />
    </main>
  );
}
