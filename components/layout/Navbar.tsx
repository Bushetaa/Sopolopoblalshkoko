"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Sun, Moon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@teispace/next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export function Navbar() {
  const { theme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/about", label: "About" },
    { href: "/docs", label: "Docs" },
  ];

  const dashboardRoutes = [
    "/dashboard",
    "/api-manager",
    "/api-gateway",
    "/workspaces",
    "/analytics",
    "/rate-limiting",
    "/settings",
    "/collections",
    "/logs"
  ];
  const isDashboard = dashboardRoutes.some(route => pathname?.startsWith(route));

  if (!mounted || pathname === "/auth/v-auth-721" || pathname?.startsWith("/_internal/verify") || pathname?.startsWith("/internal/verify") || pathname?.startsWith("/docs") || isDashboard) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-panel border-b-white/5 border-x-0 border-t-0 bg-background/60 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">

        <Link href="/" className="flex items-center gap-3 group relative z-[101]">
          <img
            src="/assets/sopo_logo.gif"
            alt="Sopo Logo"
            className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:drop-shadow-[0_0_8px_rgba(0,183,255,0.5)] transition-all"
          />
          <span className="font-display font-bold text-lg md:text-xl tracking-wider text-foreground uppercase">SOPO</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-muted-foreground"}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>

          <Link href="/signin" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Sign in</Link>
          <Link href="/signup" className="text-sm font-medium">
            <Button data-testid="nav-signup" className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary hover:text-primary-foreground font-display tracking-wide">
              Sign up
            </Button>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-4 md:hidden relative z-[101]">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full w-9 h-9"
          >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground p-2 hover:bg-white/5 rounded-lg transition-colors"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "100vh" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed inset-0 top-0 left-0 w-full bg-background/95 backdrop-blur-2xl z-[100] md:hidden overflow-hidden"
          >
            <div className="flex flex-col items-center justify-center h-full gap-8 px-6 pt-20">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Link
                    href={link.href}
                    className={`text-3xl font-display font-black tracking-tighter transition-colors hover:text-primary ${pathname === link.href ? "text-primary" : "text-foreground"}`}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navLinks.length * 0.1 }}
                className="w-full max-w-xs h-[1px] bg-white/10 my-4"
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navLinks.length + 1) * 0.1 }}
                className="flex flex-col gap-4 w-full max-w-xs"
              >
                <Link href="/signin" className="w-full">
                  <Button variant="ghost" className="w-full text-xl h-14 font-display font-bold">Sign In</Button>
                </Link>
                <Link href="/signup" className="w-full">
                  <Button className="w-full text-xl h-14 font-display font-black bg-primary text-primary-foreground shadow-[0_10px_30px_rgba(var(--primary-rgb),0.3)]">
                    START NOW
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}