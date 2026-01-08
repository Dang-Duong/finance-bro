"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import UserIcon from "../icons/UserIcon";

type User = {
  username: string;
  email: string;
  name?: string;
  surname?: string;
};

type ThemeMode = "dark" | "light";

const THEME_STORAGE_KEY = "theme";

export default function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [theme, setTheme] = useState<ThemeMode>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem(
      THEME_STORAGE_KEY
    ) as ThemeMode | null;
    const initialTheme: ThemeMode = savedTheme === "light" ? "light" : "dark";

    setTheme(initialTheme);

    if (initialTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const nextTheme: ThemeMode = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/auth/verify", {
          credentials: "include",
        });
        if (response.ok) {
          const data = await response.json();
          if (data.valid && data.user) {
            setUser(data.user);
          }
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      router.push("/login");
      if (!response.ok) console.error("Logout failed");
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const getUserDisplayName = () => {
    if (!user?.username) return "User";
    return user.username.charAt(0).toUpperCase() + user.username.slice(1);
  };

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        className="flex items-center justify-center w-10 h-10 rounded-full bg-nav-inactive hover:bg-nav-inactive-hover text-gray-100 transition-all border border-transparent hover:border-gray-600"
        aria-label="User menu"
      >
        <UserIcon className="w-5 h-5 text-gray-100" />
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-lg shadow-lg border py-2 z-50 bg-card text-card-foreground">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-semibold">{getUserDisplayName()}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {user.email}
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Theme: {theme === "dark" ? "Dark" : "Light"}
              </button>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-muted-foreground">
                Loading user info...
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
