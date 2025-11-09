"use client";

import { useState, useEffect } from "react";

export type User = {
  username: string;
  email: string;
  name?: string;
  surname?: string;
};

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          if (data.valid && data.user) {
            setUser(data.user);
            setError(null);
          } else {
            setUser(null);
            setError("Not authenticated");
          }
        } else {
          setUser(null);
          setError("Authentication failed");
        }
      } catch {
        setUser(null);
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { user, loading, error };
}

export async function checkAuth(): Promise<User | null> {
  try {
    const response = await fetch("/api/auth/verify", {
      credentials: "include",
    });

    if (response.ok) {
      const data = await response.json();
      if (data.valid && data.user) {
        return data.user;
      }
    }
    return null;
  } catch (error) {
    console.error("Auth check failed:", error);
    return null;
  }
}

export function getUserFromCookie(): User | null {
  if (typeof document === "undefined") return null;

  try {
    const cookies = document.cookie.split("; ");
    const userCookie = cookies.find((c) => c.startsWith("user="));
    if (userCookie) {
      const userData = decodeURIComponent(userCookie.split("=")[1]);
      return JSON.parse(userData);
    }
  } catch (error) {
    console.error("Failed to parse user cookie:", error);
  }
  return null;
}
