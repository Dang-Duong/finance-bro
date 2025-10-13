"use client";

import { useState } from "react";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Finance Bro</h1>
          <p className="text-gray-600">
            {isLogin ? "Welcome back!" : "Create your account"}
          </p>
        </div>

        {/* Toggle buttons */}
        <div className="flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setIsLogin(true)}
            className={`px-4 py-2 text-sm font-medium border rounded-l-lg ${
              isLogin
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Login
          </button>
          <button
            type="button"
            onClick={() => setIsLogin(false)}
            className={`px-4 py-2 text-sm font-medium border rounded-r-lg ${
              !isLogin
                ? "bg-green-600 text-white border-green-600"
                : "bg-white text-gray-900 border-gray-200 hover:bg-gray-50"
            }`}
          >
            Register
          </button>
        </div>

        {/* Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-gray-500">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:text-blue-500 font-medium"
            >
              {isLogin ? "Register here" : "Login here"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
