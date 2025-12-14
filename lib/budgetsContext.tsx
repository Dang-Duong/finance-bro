"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type Budget = {
  _id: string;
  category: { _id: string; name: string };
  amount: number;
  month: number; // 0-11
  year: number;
  spent: number;
  progress: number; // percentage
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

interface BudgetsContextType {
  budgets: Budget[];
  filteredBudgets: Budget[];
  loading: boolean;
  fetchBudgets: (month?: number, year?: number) => Promise<void>;
  refreshBudgets: () => void;
  currentMonth?: number;
  currentYear?: number;
  setCategoryFilter: (categoryId: string | null) => void;
  setSearchFilter: (search: string) => void;
}

const BudgetsContext = createContext<BudgetsContextType | undefined>(undefined);

export function BudgetsProvider({ children }: { children: ReactNode }) {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [currentMonth, setCurrentMonth] = useState<number | undefined>();
  const [currentYear, setCurrentYear] = useState<number | undefined>();
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState<string>("");

  const fetchBudgets = useCallback(async (month?: number, year?: number) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (month !== undefined) {
        params.append("month", month.toString());
      }
      if (year !== undefined) {
        params.append("year", year.toString());
      }

      const url = `/api/budgets${
        params.toString() ? `?${params.toString()}` : ""
      }`;
      const response = await fetch(url);
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setBudgets(result.data || []);
          // Only update currentMonth/currentYear if they were provided
          if (month !== undefined) setCurrentMonth(month);
          if (year !== undefined) setCurrentYear(year);
        }
      }
    } catch (error) {
      console.error("Error fetching budgets:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshBudgets = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useEffect(() => {
    // Default to current month/year if no filters set
    const now = new Date();
    const month = currentMonth ?? now.getMonth();
    const year = currentYear ?? now.getFullYear();
    fetchBudgets(month, year);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchBudgets, refreshTrigger]);

  // Filter budgets based on category and search
  const filteredBudgets = budgets.filter((budget) => {
    // Category filter
    if (categoryFilter && budget.category._id !== categoryFilter) {
      return false;
    }
    // Search filter (case-insensitive search in category name)
    if (searchFilter) {
      const searchLower = searchFilter.toLowerCase();
      return budget.category.name.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <BudgetsContext.Provider
      value={{
        budgets,
        filteredBudgets,
        loading,
        fetchBudgets,
        refreshBudgets,
        currentMonth,
        currentYear,
        setCategoryFilter,
        setSearchFilter,
      }}
    >
      {children}
    </BudgetsContext.Provider>
  );
}

export function useBudgets() {
  const context = useContext(BudgetsContext);
  if (context === undefined) {
    throw new Error("useBudgets must be used within a BudgetsProvider");
  }
  return context;
}
