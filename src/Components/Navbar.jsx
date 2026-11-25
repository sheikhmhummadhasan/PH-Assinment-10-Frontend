"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  FaBusAlt,
  FaBars,
  FaTimes,
  FaUser,
  FaTicketAlt,
  FaSignOutAlt,
  FaChevronDown,
  FaHome,
  FaSun,
  FaMoon,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import { authClient } from "@/app/lib/auth-client";


const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const { data: session, isPending } = authClient.useSession();
  const { resolvedTheme, setTheme } = useTheme();

  const pathname = usePathname();
  const router = useRouter();

  const user = session?.user;
  const userRole = user?.role?.toLowerCase();

  const dashboardPath = {
    user: "/userDashbord",
    vendor: "/vandorDashbord",
    admin: "/adminDashbord",
  };

  const userDashboard = dashboardPath[userRole] || "/dashboard";

  const navLinks = [
    {
      name: "Home",
      href: "/",
      icon: FaHome,
    },
    {
      name: "All Tickets",
      href: "/all-tickets",
      icon: FaTicketAlt,
    },
    ...(user
      ? [
          {
            name: "Dashboard",
            href: userDashboard,
            icon: FaTachometerAlt,
          },
        ]
      : []),
  ];

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      setDropdownOpen(false);
      setMenuOpen(false);
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#E2E8F0] bg-white/95 backdrop-blur-xl dark:border-[#1F2A3D] dark:bg-[#0B1220]/95">
      <nav className="w-full px-4 sm:px-6 lg:px-10">
        <div className="flex min-h-[76px] w-full items-center justify-between gap-6">
          <Link
            href="/"
            className="flex shrink-0 items-center gap-2.5"
            onClick={() => setMenuOpen(false)}
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0F766E] text-white dark:bg-[#2DD4BF] dark:text-[#0B1220]">
              <FaBusAlt size={21} />
            </span>

            <span className="text-2xl font-extrabold tracking-tight text-[#0F172A] dark:text-[#E2E8F0]">
              Ticket<span className="text-[#0F766E] dark:text-[#2DD4BF]">Bari</span>
            </span>
          </Link>

          <div className="hidden flex-1 items-center justify-center md:flex">
            <div className="flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 text-lg font-semibold transition-colors ${
                      isActive(link.href)
                        ? "text-[#0F766E] dark:text-[#2DD4BF]"
                        : "text-[#334155] hover:text-[#0F766E] dark:text-[#CBD5E1] dark:hover:text-[#2DD4BF]"
                    }`}
                  >
                    <Icon size={16} />
                    {link.name}
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="hidden shrink-0 items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E2E8F0] text-[#334155] transition-colors hover:bg-[#F1F5F9] dark:border-[#1F2A3D] dark:text-[#E2E8F0] dark:hover:bg-[#131C2E]"
            >
              <span className="hidden dark:inline-flex">
                <FaSun size={18} />
              </span>
              <span className="inline-flex dark:hidden">
                <FaMoon size={18} />
              </span>
            </button>

            {isPending ? (
              <div className="h-10 w-28 animate-pulse rounded-md bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
            ) : user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  aria-expanded={dropdownOpen}
                  className="flex items-center gap-2 rounded-md border border-[#E2E8F0] px-3 py-2 transition-colors hover:bg-[#F8FAFC] dark:border-[#1F2A3D] dark:hover:bg-[#131C2E]"
                >
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-8 w-8 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-md bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]">
                      <FaUser size={15} />
                    </span>
                  )}

                  <span className="max-w-[120px] truncate text-sm font-semibold text-[#0F172A] dark:text-[#E2E8F0]">
                    {user.name || "My Account"}
                  </span>

                  <FaChevronDown
                    size={12}
                    className={`text-[#64748B] transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-md border border-[#E2E8F0] bg-white shadow-xl dark:border-[#1F2A3D] dark:bg-[#131C2E]">
                    <div className="border-b border-[#E2E8F0] px-4 py-4 dark:border-[#1F2A3D]">
                      <p className="truncate text-sm font-bold text-[#0F172A] dark:text-[#E2E8F0]">
                        {user.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
                        {user.email}
                      </p>

                      <span className="mt-2 inline-block rounded-md bg-[#CCFBF1] px-2 py-1 text-xs font-semibold capitalize text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]">
                        {userRole || "user"}
                      </span>
                    </div>

                    <div className="p-2">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#334155] transition-colors hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#1F2A3D]"
                      >
                        <FaUserCircle size={17} />
                        My Profile
                      </Link>

                      <Link
                        href={userDashboard}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium text-[#334155] transition-colors hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#1F2A3D]"
                      >
                        <FaTachometerAlt size={17} />
                        My Dashboard
                      </Link>

                      <button
                        type="button"
                        onClick={handleLogout}
                        className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 dark:hover:bg-red-950/30"
                      >
                        <FaSignOutAlt size={17} />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  href="/login"
                  className="rounded-md px-4 py-2.5 text-sm font-semibold text-[#0F766E] transition-colors hover:bg-[#F0FDFA] dark:text-[#2DD4BF] dark:hover:bg-[#131C2E]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-md bg-[#0F766E] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#115E59] dark:bg-[#2DD4BF] dark:text-[#0B1220] dark:hover:bg-[#5EEAD4]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="flex shrink-0 items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="flex h-10 w-10 items-center justify-center rounded-md border border-[#E2E8F0] text-[#334155] dark:border-[#1F2A3D] dark:text-[#E2E8F0]"
            >
              <span className="hidden dark:inline-flex">
                <FaSun size={18} />
              </span>
              <span className="inline-flex dark:hidden">
                <FaMoon size={18} />
              </span>
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={menuOpen}
              className="flex h-10 w-10 items-center justify-center rounded-md bg-[#0F766E] text-white dark:bg-[#2DD4BF] dark:text-[#0B1220]"
            >
              {menuOpen ? <FaTimes size={19} /> : <FaBars size={19} />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="border-t border-[#E2E8F0] py-4 dark:border-[#1F2A3D] md:hidden">
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-md px-4 py-3 text-base font-semibold transition-colors ${
                      isActive(link.href)
                        ? "bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]"
                        : "text-[#334155] hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#131C2E]"
                    }`}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
            </div>

            {isPending ? (
              <div className="mt-4 h-16 animate-pulse rounded-md bg-[#E2E8F0] dark:bg-[#1F2A3D]" />
            ) : user ? (
              <div className="mt-4 border-t border-[#E2E8F0] pt-4 dark:border-[#1F2A3D]">
                <div className="mb-3 flex items-center gap-3 px-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name || "User"}
                      className="h-10 w-10 rounded-md object-cover"
                    />
                  ) : (
                    <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#CCFBF1] text-[#0F766E] dark:bg-[#134E4A] dark:text-[#2DD4BF]">
                      <FaUser size={18} />
                    </span>
                  )}

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-[#0F172A] dark:text-[#E2E8F0]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#64748B] dark:text-[#94A3B8]">
                      {user.email}
                    </p>
                  </div>
                </div>

                <Link
                  href="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#131C2E]"
                >
                  <FaUserCircle size={17} />
                  My Profile
                </Link>

                <Link
                  href={userDashboard}
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 rounded-md px-4 py-3 text-sm font-medium text-[#334155] hover:bg-[#F1F5F9] dark:text-[#CBD5E1] dark:hover:bg-[#131C2E]"
                >
                  <FaTachometerAlt size={17} />
                  My Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-3 rounded-md px-4 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <FaSignOutAlt size={17} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="mt-4 flex gap-2 border-t border-[#E2E8F0] pt-4 dark:border-[#1F2A3D]">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-md border border-[#0F766E] py-3 text-center text-sm font-semibold text-[#0F766E] dark:border-[#2DD4BF] dark:text-[#2DD4BF]"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-md bg-[#0F766E] py-3 text-center text-sm font-semibold text-white dark:bg-[#2DD4BF] dark:text-[#0B1220]"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;