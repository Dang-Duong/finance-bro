"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import EnvelopeIcon from "../icons/EnvelopeIcon";
import LockIcon from "../icons/LockIcon";
import UserIcon from "../icons/UserIcon";

export default function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // Basic validation
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    // Check for capital letter
    if (!/[A-Z]/.test(password)) {
      setMessage("Password must contain at least 1 capital letter");
      setLoading(false);
      return;
    }

    try {
      // Split name into name and surname
      const nameParts = name.trim().split(/\s+/);
      const firstName = nameParts[0] || "";
      const surname = nameParts.slice(1).join(" ") || firstName; // Use first name as surname if no last name provided

      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name: firstName,
          surname,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful! Redirecting to login...");
        // Clear form
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        // Redirect to login after a delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        setMessage(data.message || data.error || "Registration failed");
      }
    } catch (error) {
      setMessage("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg p-8 lg:p-10 shadow-lg">
      {/* Dark mode styles for later: bg-gray-800 */}
      <p className="text-sm text-gray-600 mb-2">Start for free</p>
      {/* Dark mode: text-gray-400 */}
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Sign Up</h2>
      {/* Dark mode: text-white */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {/* Dark mode: text-gray-300 */}
            Name
          </label>
          <div className="relative">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
            {/* Dark mode input: bg-gray-700 border-gray-600 text-white placeholder-gray-400 */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <UserIcon />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {/* Dark mode: text-gray-300 */}
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
            {/* Dark mode input: bg-gray-700 border-gray-600 text-white placeholder-gray-400 */}
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
            {/* Dark mode: text-gray-300 */}
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
            {/* Dark mode input: bg-gray-700 border-gray-600 text-white placeholder-gray-400 */}
            <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
              <LockIcon />
            </div>
          </div>
        </div>

        <div>
          <label
            htmlFor="confirm-password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            {/* Dark mode: text-gray-300 */}
            Re-type Password
          </label>
          <div className="relative">
            <input
              type="password"
              id="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-4 py-3 pr-12 bg-gray-100 border border-gray-200 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Re-enter your password"
            />
            {/* Dark mode input: bg-gray-700 border-gray-600 text-white placeholder-gray-400 */}
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
          {/* Dark mode button: focus:ring-offset-gray-800 */}
          {loading ? "Creating account..." : "Create account"}
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
          {/* Dark mode message: bg-green-900/50 text-green-300 border border-green-700 | bg-red-900/50 text-red-300 border border-red-700 */}
          {message}
        </div>
      )}

      <p className="mt-6 text-center text-sm text-gray-600">
        {/* Dark mode: text-gray-400 */}
        Already have an account?{" "}
        <Link
          href="/login"
          className="text-primary font-medium hover:underline"
        >
          Sign in
        </Link>
      </p>
    </div>
  );
}
