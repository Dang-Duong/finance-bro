"use client";

import { useState } from "react";
import Image from "next/image";
import BrandLogo from "../components/welcome/BrandLogo";
import LoginForm from "../components/LoginForm";
import RegisterForm from "../components/RegisterForm";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#1F3141] relative">
      {/* Logo - centered on mobile, top-left on desktop */}
      <div className="flex justify-center pt-8 pb-4 lg:absolute lg:top-12 lg:left-12 lg:justify-start lg:pt-0 lg:pb-0 z-10">
        <BrandLogo />
      </div>

      {/* Main content area */}
      <div className="min-h-screen flex flex-col lg:flex-row">
        {/* Left Section - Branding and Illustration - Hidden on mobile */}
        <div className="hidden lg:flex flex-1 flex-col items-center justify-center p-8 lg:p-12">
          <div className="flex items-center justify-center">
            <Image
              src="/imgs/loginImg.png"
              alt="Finance app illustration"
              width={600}
              height={600}
              className="w-[500px] h-auto"
              priority
            />
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="flex-1 flex items-center justify-center p-8 lg:p-12">
          <div className="w-full max-w-md">
            {isLogin ? (
              <LoginForm setIsLogin={setIsLogin} />
            ) : (
              <RegisterForm setIsLogin={setIsLogin} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
