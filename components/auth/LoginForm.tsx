"use client";

import { useState } from "react";
import Link from "next/link";
import EnvelopeIcon from "../icons/EnvelopeIcon";
import LockIcon from "../icons/LockIcon";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        setMessage("Login successful!");
        // Redirect to dashboard
        window.location.href = "/dashboard";
      } else {
        setMessage(data.error || data.message || "Login failed");
      }
    } catch (error) {
      setMessage(`Network error. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 lg:p-10 shadow-lg">
      <p className="text-sm text-gray-600 mb-2">Start for free</p>
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign In</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <EnvelopeIcon />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="6+ Characters, 1 Capital letter"
            />
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LockIcon />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>

      {message && (
        <div
          className={`mt-4 p-3 rounded-lg text-sm ${
            message.includes("successful")
              ? "bg-success-bg text-success-text"
              : "bg-error-bg text-error-text"
          }`}
        >
          {message}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        Don't have any account?{" "}
        <Link
          href="/signup"
          className="text-primary font-medium hover:underline"
        >
          Sign Up
        </Link>
      </p>
    </div>
  );
}
