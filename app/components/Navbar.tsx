"use client";

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

  const baseButtonClasses =
    "rounded-full px-6 py-2 text-sm font-medium border transition-all";
  const inactiveClasses =
    "bg-[#0E304C] text-gray-100 border-transparent hover:bg-[#153A5A]";
  const activeClasses = "bg-white text-black border-white shadow";

  return (
    <header className="w-full bg-[#061E34]">
      <div className="mx-auto flex items-center gap-12 px-6 py-3">
        <Image
          src="/logo.svg"
          alt="FinanceBro logo"
          width={150}   // reduced from 350
          height={150}
          priority
        />

        <nav className="flex items-center gap-3">
          {navItems.map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${baseButtonClasses} ${
                  isActive ? activeClasses : inactiveClasses
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
