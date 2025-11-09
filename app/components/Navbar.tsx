"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home Page", href: "/dashboard" },
  { label: "Transaction", href: "/transaction" },
  { label: "Budget", href: "/budget" },
  { label: "Savings", href: "/savings" },
  { label: "Category", href: "/category" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const baseButtonClasses =
    "rounded-full px-6 py-2 text-sm font-medium border transition-all";
  const inactiveClasses =
    "bg-[#0E304C] text-gray-100 border-transparent hover:bg-[#153A5A]";
  const activeClasses = "bg-white text-black border-white shadow";

  const renderLink = (item: (typeof navItems)[number]) => {
    const isActive = pathname === item.href;

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`${baseButtonClasses} ${
          isActive ? activeClasses : inactiveClasses
        }`}
        onClick={() => setIsOpen(false)}
      >
        {item.label}
      </Link>
    );
  };

  return (
    <header className="w-full bg-[#061E34]">
      <div className="mx-auto flex items-center justify-between px-4 py-3 md:px-6 md:py-3">
        <div className="flex items-center gap-6">
          <Image
            src="/logo.svg"
            alt="FinanceBro logo"
            width={150}
            height={150}
            priority
          />

          {/* Navigation for desktop */}
          <nav className="hidden md:flex items-center gap-3">
            {navItems.map(renderLink)}
          </nav>
        </div>

        {/* Menu toggle for mobile view */}
        <button
          type="button"
          className="md:hidden text-white border border-[#0E304C] rounded-md px-3 py-2 text-sm font-medium hover:bg-[#153A5A]"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          {isOpen ? "Zavřít" : "Menu"}
        </button>
      </div>

      {/* Collapsible mobile menu */}
      {isOpen && (
        <nav className="md:hidden px-4 pb-4 flex flex-col gap-2">
          {navItems.map(renderLink)}
        </nav>
      )}
    </header>
  );
}
