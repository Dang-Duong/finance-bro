"use client";

import { useEffect, useState } from "react";
import { checkAuth } from "@/lib/auth";
import { SavingsProvider, useSavings } from "@/lib/savingsContext";
import { SavingsContent } from "@/components/savings/SavingsContent";
import AddDepositModal from "@/components/savings/AddDepositModal";
import AddGoalModal from "@/components/savings/AddGoalModal";
import DeleteConfirmationModal from "@/components/savings/DeleteConfirmationModal";

function SavingsPageContent() {
  const {
    goals,
    deposits,
    loading,
    createGoal,
    updateGoal,
    deleteGoal,
    createDeposit,
    deleteDeposit,
  } = useSavings();

  const [isAddDepositModalOpen, setIsAddDepositModalOpen] = useState(false);
  const [isAddGoalModalOpen, setIsAddGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<
    (typeof goals)[0] | null | undefined
  >(null);
  const [isDeleteGoalModalOpen, setIsDeleteGoalModalOpen] = useState(false);
  const [isDeleteDepositModalOpen, setIsDeleteDepositModalOpen] =
    useState(false);
  const [deletingGoalId, setDeletingGoalId] = useState<string | null>(null);
  const [deletingDepositId, setDeletingDepositId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const verifyAuth = async () => {
      const user = await checkAuth();
      if (!user) {
        window.location.href = "/login";
      }
    };
    verifyAuth();
  }, []);

  const handleAddDeposit = async (data: {
    goalId: string;
    amount: number;
    date?: string;
  }) => {
    try {
      await createDeposit(data.goalId, data.amount, data.date);
      setIsAddDepositModalOpen(false);
    } catch (error) {
      console.error("Error adding deposit:", error);
      throw error;
    }
  };

  const handleDeleteDepositClick = (id: string) => {
    setDeletingDepositId(id);
    setIsDeleteDepositModalOpen(true);
  };

  const handleConfirmDeleteDeposit = async () => {
    if (!deletingDepositId) return;

    try {
      await deleteDeposit(deletingDepositId);
      setIsDeleteDepositModalOpen(false);
      setDeletingDepositId(null);
    } catch (error) {
      console.error("Error deleting deposit:", error);
    }
  };

  const handleAddGoal = async (data: { name: string; goalAmount: number }) => {
    try {
      if (editingGoal) {
        await updateGoal(editingGoal._id, data.name, data.goalAmount);
      } else {
        await createGoal(data.name, data.goalAmount);
      }
      setIsAddGoalModalOpen(false);
      setEditingGoal(null);
    } catch (error) {
      console.error("Error adding/updating goal:", error);
      throw error;
    }
  };

  const handleEditGoal = (goal: (typeof goals)[0]) => {
    setEditingGoal(goal);
    setIsAddGoalModalOpen(true);
  };

  const handleDeleteGoalClick = (id: string) => {
    setDeletingGoalId(id);
    setIsDeleteGoalModalOpen(true);
  };

  const handleConfirmDeleteGoal = async () => {
    if (!deletingGoalId) return;

    try {
      await deleteGoal(deletingGoalId);
      setIsDeleteGoalModalOpen(false);
      setDeletingGoalId(null);
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-navbar-bg text-white px-4 py-6 md:px-8 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg">Loading savings...</div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-navbar-bg text-white px-4 py-6 md:px-8">
      <SavingsContent
        goals={goals}
        deposits={deposits}
        onAddDeposit={() => setIsAddDepositModalOpen(true)}
        onDeleteDeposit={handleDeleteDepositClick}
        onAddGoal={() => {
          setEditingGoal(null);
          setIsAddGoalModalOpen(true);
        }}
        onEditGoal={handleEditGoal}
        onDeleteGoal={handleDeleteGoalClick}
      />

      <AddDepositModal
        isOpen={isAddDepositModalOpen}
        onClose={() => setIsAddDepositModalOpen(false)}
        onSubmit={handleAddDeposit}
        goals={goals}
      />

      <AddGoalModal
        isOpen={isAddGoalModalOpen}
        onClose={() => {
          setIsAddGoalModalOpen(false);
          setEditingGoal(null);
        }}
        onSubmit={handleAddGoal}
        editingGoal={editingGoal || undefined}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteGoalModalOpen}
        onClose={() => {
          setIsDeleteGoalModalOpen(false);
          setDeletingGoalId(null);
        }}
        onConfirm={handleConfirmDeleteGoal}
        title="Delete Goal"
        message="Are you sure you want to delete this goal?"
        warningMessage="All associated deposits will also be deleted. This action cannot be undone."
      />

      <DeleteConfirmationModal
        isOpen={isDeleteDepositModalOpen}
        onClose={() => {
          setIsDeleteDepositModalOpen(false);
          setDeletingDepositId(null);
        }}
        onConfirm={handleConfirmDeleteDeposit}
        title="Delete Deposit"
        message="Are you sure you want to delete this deposit?"
        warningMessage="This action cannot be undone."
      />
    </main>
  );
}

export default function SavingsPage() {
  return (
    <SavingsProvider>
      <SavingsPageContent />
    </SavingsProvider>
  );
}
