"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type SavingGoal = {
  _id: string;
  userId: string;
  name: string;
  goalAmount: number;
  currentAmount: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type SavingDeposit = {
  _id: string;
  userId: string;
  goalId: string;
  amount: number;
  date: string | Date;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

interface SavingsContextType {
  goals: SavingGoal[];
  deposits: SavingDeposit[];
  loading: boolean;
  fetchGoals: () => Promise<void>;
  fetchDeposits: (goalId?: string) => Promise<void>;
  createGoal: (name: string, goalAmount: number) => Promise<void>;
  updateGoal: (id: string, name?: string, goalAmount?: number) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
  createDeposit: (
    goalId: string,
    amount: number,
    date?: string
  ) => Promise<void>;
  deleteDeposit: (id: string) => Promise<void>;
  refreshSavings: () => void;
}

const SavingsContext = createContext<SavingsContextType | undefined>(undefined);

export function SavingsProvider({ children }: { children: ReactNode }) {
  const [goals, setGoals] = useState<SavingGoal[]>([]);
  const [deposits, setDeposits] = useState<SavingDeposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchGoals = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/savings/goals");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setGoals(result.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching goals:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchDeposits = useCallback(async (goalId?: string) => {
    try {
      const url = goalId
        ? `/api/savings/deposits?goalId=${goalId}`
        : "/api/savings/deposits";
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDeposits(result.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching deposits:", error);
    }
  }, []);

  const createGoal = useCallback(
    async (name: string, goalAmount: number) => {
      try {
        const response = await fetch("/api/savings/goals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, goalAmount }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await fetchGoals();
          } else {
            throw new Error(result.error || "Failed to create goal");
          }
        } else {
          const result = await response.json();
          throw new Error(result.error || "Failed to create goal");
        }
      } catch (error) {
        console.error("Error creating goal:", error);
        throw error;
      }
    },
    [fetchGoals]
  );

  const updateGoal = useCallback(
    async (id: string, name?: string, goalAmount?: number) => {
      try {
        const body: { name?: string; goalAmount?: number } = {};
        if (name !== undefined) body.name = name;
        if (goalAmount !== undefined) body.goalAmount = goalAmount;

        const response = await fetch(`/api/savings/goals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await fetchGoals();
          } else {
            throw new Error(result.error || "Failed to update goal");
          }
        } else {
          const result = await response.json();
          throw new Error(result.error || "Failed to update goal");
        }
      } catch (error) {
        console.error("Error updating goal:", error);
        throw error;
      }
    },
    [fetchGoals]
  );

  const deleteGoal = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/savings/goals/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await fetchGoals();
            await fetchDeposits(); // Refresh deposits in case any were deleted
          } else {
            throw new Error(result.error || "Failed to delete goal");
          }
        } else {
          const result = await response.json();
          throw new Error(result.error || "Failed to delete goal");
        }
      } catch (error) {
        console.error("Error deleting goal:", error);
        throw error;
      }
    },
    [fetchGoals, fetchDeposits]
  );

  const createDeposit = useCallback(
    async (goalId: string, amount: number, date?: string) => {
      try {
        const response = await fetch("/api/savings/deposits", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ goalId, amount, date }),
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await fetchDeposits();
            await fetchGoals(); // Refresh goals to update currentAmount
          } else {
            throw new Error(result.error || "Failed to create deposit");
          }
        } else {
          const result = await response.json();
          throw new Error(result.error || "Failed to create deposit");
        }
      } catch (error) {
        console.error("Error creating deposit:", error);
        throw error;
      }
    },
    [fetchDeposits, fetchGoals]
  );

  const deleteDeposit = useCallback(
    async (id: string) => {
      try {
        const response = await fetch(`/api/savings/deposits/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            await fetchDeposits();
            await fetchGoals(); // Refresh goals to update currentAmount
          } else {
            throw new Error(result.error || "Failed to delete deposit");
          }
        } else {
          const result = await response.json();
          throw new Error(result.error || "Failed to delete deposit");
        }
      } catch (error) {
        console.error("Error deleting deposit:", error);
        throw error;
      }
    },
    [fetchDeposits, fetchGoals]
  );

  const refreshSavings = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    fetchGoals();
    fetchDeposits();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  return (
    <SavingsContext.Provider
      value={{
        goals,
        deposits,
        loading,
        fetchGoals,
        fetchDeposits,
        createGoal,
        updateGoal,
        deleteGoal,
        createDeposit,
        deleteDeposit,
        refreshSavings,
      }}
    >
      {children}
    </SavingsContext.Provider>
  );
}

export function useSavings() {
  const context = useContext(SavingsContext);
  if (context === undefined) {
    throw new Error("useSavings must be used within a SavingsProvider");
  }
  return context;
}
