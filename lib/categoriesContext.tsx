"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";

export type Category = {
  _id: string;
  name: string;
  description?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

interface CategoriesContextType {
  categories: Category[];
  loading: boolean;
  fetchCategories: () => Promise<void>;
  refreshCategories: () => void;
  getCategoryById: (id: string) => Promise<Category | null>;
}

const CategoriesContext = createContext<CategoriesContextType | undefined>(
  undefined
);

export function CategoriesProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/category");
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setCategories(result.data || []);
        }
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshCategories = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  const getCategoryById = useCallback(
    async (id: string): Promise<Category | null> => {
      try {
        const response = await fetch(`/api/category/${id}`);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            return result.data;
          }
        }
        return null;
      } catch (error) {
        console.error("Error fetching category by ID:", error);
        return null;
      }
    },
    []
  );

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories, refreshTrigger]);

  return (
    <CategoriesContext.Provider
      value={{
        categories,
        loading,
        fetchCategories,
        refreshCategories,
        getCategoryById,
      }}
    >
      {children}
    </CategoriesContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoriesContext);
  if (context === undefined) {
    throw new Error("useCategories must be used within a CategoriesProvider");
  }
  return context;
}
