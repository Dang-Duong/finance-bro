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

export default function UserDropdown() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Fetch user info from backend
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

  // Close dropdown when clicking outside
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

      if (response.ok) {
        router.push("/login");
      } else {
        console.error("Logout failed");
        // Still redirect to login even if logout fails
        router.push("/login");
      }
    } catch (error) {
      console.error("Logout error:", error);
      router.push("/login");
    }
  };

  const getUserDisplayName = () => {
    if (!user?.username) return "User";
    return user.username.charAt(0).toUpperCase() + user.username.slice(1);
  };

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
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {user ? (
            <>
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {getUserDisplayName()}
                </p>
                <p className="text-xs text-gray-500 mt-1">{user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Log out
              </button>
            </>
          ) : (
            <div className="px-4 py-3">
              <p className="text-sm text-gray-500">Loading user info...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
