"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth";
import { useCategories } from "@/lib/categoriesContext";

export default function CategoryPage() {
  const { user, loading: authLoading } = useAuth();
  const { categories, loading: categoriesLoading, refreshCategories } = useCategories();

  useEffect(() => {
    if (!authLoading && !user) {
      window.location.href = "/login";
    }
  }, [user, authLoading]);

  if (authLoading || !user) {
    return (
      <main className="min-h-screen bg-primary-dark p-4 lg:p-6 pt-28 lg:pt-6">
        <div className="text-white">Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-primary-dark p-4 lg:p-6 pt-28 lg:pt-6">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 rounded-lg p-6 border border-white/10"
        >
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-semibold text-white">Categories</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={refreshCategories}
              className="px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-hover transition-colors"
            >
              Refresh
            </motion.button>
          </div>

          {categoriesLoading ? (
            <div className="py-8 text-center text-white/60">
              Loading categories...
            </div>
          ) : categories.length === 0 ? (
            <div className="py-8 text-center text-white/60">
              No categories found. Categories will appear here once they are created.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => {
                const capitalizeFirst = (str: string) => {
                  if (!str) return str;
                  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
                };
                return (
                  <motion.div
                    key={category._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-white/5 rounded-lg p-4 border border-white/10 hover:bg-white/10 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {capitalizeFirst(category.name)}
                      </h3>
                    </div>
                    {category.description && (
                      <p className="text-sm text-white/60 mb-3">
                        {category.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-white/40">
                      <span>ID: {category._id}</span>
                    </div>
                    {category.createdAt && (
                      <div className="mt-2 text-xs text-white/40">
                        Created: {new Date(category.createdAt).toLocaleDateString()}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
