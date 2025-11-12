"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import UserDropdown from "./UserDropdown";
import StaggeredMenu, { StaggeredMenuItem } from "./StaggeredMenu";

const navItems = [
  { label: "Home Page", href: "/dashboard" },
  { label: "Transaction", href: "/transaction" },
  { label: "Budget", href: "/budget" },
  { label: "Savings", href: "/savings" },
];

export default function Navbar() {
  const pathname = usePathname();

  // Convert navItems to StaggeredMenuItem format
  const staggeredMenuItems: StaggeredMenuItem[] = navItems.map((item) => ({
    label: item.label.toUpperCase(),
    ariaLabel: item.label,
    link: item.href,
  }));

  const baseButtonClasses =
    "rounded-full px-3 lg:px-5 py-1.5 text-xs lg:text-sm font-medium border transition-all whitespace-nowrap";
  const inactiveClasses =
    "bg-nav-inactive text-gray-100 border-transparent hover:bg-nav-inactive-hover";
  const activeClasses = "bg-white text-black border-white shadow";

  return (
    <>
      {/* Mobile Staggered Menu */}
      <div className="lg:hidden">
        <StaggeredMenu
          position="right"
          colors={["#061e34", "#0e304c", "#153a5a"]}
          items={staggeredMenuItems}
          displaySocials={false}
          displayItemNumbering={false}
          logoUrl="/Logo.svg"
          menuButtonColor="#e9e9ef"
          openMenuButtonColor="#000"
          accentColor="#0a66e8"
          isFixed={true}
          changeMenuColorOnOpen={true}
        />
      </div>

      {/* Desktop Navbar */}
      <header className="hidden lg:block w-full bg-navbar-bg relative z-40">
        <div className="mx-auto flex items-center justify-between gap-2 lg:gap-4 px-3 lg:px-6 py-1 lg:py-6">
          <div className="flex items-center gap-2 lg:gap-4 flex-1 lg:flex-none">
            <Image
              src="/Logo.svg"
              alt="FinanceBro logo"
              width={150}
              height={150}
              priority
            />

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-3">
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

          {/* Desktop User Dropdown */}
          <div className="hidden lg:block">
            <UserDropdown />
          </div>
        </div>
      </header>
    </>
  );
}
