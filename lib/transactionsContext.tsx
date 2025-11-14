"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

type Transaction = {
  _id: string;
  amount: number;
  incoming: boolean;
  createdAt: string | Date;
  category?: string;
  description?: string;
};

interface TransactionsContextType {
  transactions: Transaction[];
  loading: boolean;
  fetchTransactions: () => Promise<void>;
  refreshTransactions: () => void;
  addTransaction: (transaction: Transaction) => void;
}

const TransactionsContext = createContext<TransactionsContextType | undefined>(
  undefined
);

export function TransactionsProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchTransactions = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/transactions");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          // Normalize category field - handle both object and string
          const capitalizeFirst = (str: string) => {
            if (!str) return str;
            return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
          };

          const normalizedTransactions = (result.data || []).map(
            (transaction: any) => ({
              ...transaction,
              category:
                typeof transaction.category === "object" &&
                transaction.category !== null
                  ? capitalizeFirst(transaction.category.name)
                  : transaction.category
                  ? capitalizeFirst(transaction.category)
                  : undefined,
            })
          );
          setTransactions(normalizedTransactions);
        }
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshTransactions = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const addTransaction = useCallback((transaction: Transaction) => {
    setTransactions((prev) => [transaction, ...prev]);
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions, refreshTrigger]);

  return (
    <TransactionsContext.Provider
      value={{
        transactions,
        loading,
        fetchTransactions,
        refreshTransactions,
        addTransaction,
      }}
    >
      {children}
    </TransactionsContext.Provider>
  );
}

export function useTransactions() {
  const context = useContext(TransactionsContext);
  if (context === undefined) {
    throw new Error(
      "useTransactions must be used within a TransactionsProvider"
    );
  }
  return context;
}
