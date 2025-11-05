"use client";
import { useEffect, useState } from "react";

type User = {
  username: string;
  // add other user fields as needed
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (!token) {
      // není přihlášen → redirect na login
      window.location.href = "/login";
      return;
    }

    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  if (!user) return <p>Načítám...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl">Vítej, {user.username}</h1>
      <button
        className="mt-4 bg-danger text-white px-4 py-2 rounded"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "/login";
        }}
      >
        Odhlásit se
      </button>
    </div>
  );
}
