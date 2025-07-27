"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Rules", href: "/rules" },
  { name: "About", href: "/about" },
];

export default function Navbar() {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen((prev) => !prev);
  };

  return (
    <motion.nav
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center bg-white/10 backdrop-blur-2xl shadow-2xl sticky top-4 z-50 rounded-3xl"
    >
      {/* Logo */}
      <Link href="/">
        <div className="flex items-center gap-3">
          <motion.span
            className="text-2xl font-bold text-blue-400 cursor-pointer"
            style={{ fontFamily: "var(--font-spacemono)", letterSpacing: "0.03em" }}
          >
            Bluffy™
          </motion.span>
        </div>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center gap-8">
        {navItems.map(({ name, href }) => (
          <Link key={name} href={href}>
            <motion.span
              whileHover={{ scale: 1.1, color: "#60A5FA", y: -2 }}
              transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
              className="text-base font-semibold text-white cursor-pointer"
              style={{ fontFamily: "var(--font-poppins)" }}
            >
              {name}
            </motion.span>
          </Link>
        ))}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <Button
            variant="default"
            className="ml-4 px-6 py-2 font-bold bg-blue-500 hover:bg-blue-600 text-gray-100 rounded-full shadow-md text-lg transition-all font-sans"
          >
            <motion.span
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              Let&apos;s Play
            </motion.span>
          </Button>
        </motion.div>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <Button
          className="px-3 py-2 text-2xl rounded-full bg-gray-700/20 text-gray-100 backdrop-blur-md"
          onClick={toggleMobileMenu}
        >
          &#9776;
        </Button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute top-full left-0 right-0 mt-2 mx-4 bg-white/20 backdrop-blur-2xl rounded-2xl shadow-lg p-6 flex flex-col items-start gap-4 md:hidden z-40"
          >
            {navItems.map(({ name, href }) => (
              <Link key={name} href={href} onClick={() => setMobileMenuOpen(false)}>
                <span className="text-base font-semibold text-gray-900 cursor-pointer" style={{ fontFamily: "var(--font-poppins)" }}>
                  {name}
                </span>
              </Link>
            ))}
            <Button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-full px-4 py-2"
            >
              Let&apos;s Play
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
