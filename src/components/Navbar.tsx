"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Why Us", href: "/why-us" },
  { label: "Benefits", href: "/benefits" },
  { label: "Philosophy", href: "/philosophy" },
  { label: "Services", href: "/services" },
  { label: "Pricing", href: "/pricing" },
  { label: "Shop", href: "/shop" },
  { label: "Quantum Cure", href: "/quantum-cure" },
  { label: "Quantum Health", href: "/quantum-health" },
  { label: "Gallery", href: "/gallery" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "Blog", href: "/blog" },
  { label: "Training", href: "/training" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    setMobileOpen(false);
    router.push(href);
  };

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          "h-[68px] md:h-[76px] lg:h-[88px]",
          scrolled
            ? "bg-[rgba(25,16,35,0.98)] shadow-lg"
            : "bg-[rgba(25,16,35,0.95)]"
        )}
        style={{ backdropFilter: "blur(16px)" }}
      >
        <div className="h-full border-b border-[rgba(212,175,55,0.15)]">
          <div className="h-full max-w-full 2xl:max-w-[1600px] mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Left: Logo */}
            <a
              href="/"
              onClick={(e) => { e.preventDefault(); router.push("/"); }}
              className="flex items-center shrink-0"
              style={{ paddingLeft: "8px" }}
            >
              <img
                src="/images/logo.png"
                alt="Mystic Yoga"
                className="h-11 md:h-[52px] lg:h-[58px] w-auto object-contain"
              />
            </a>

            {/* Center: Nav Links */}
            <nav className="hidden xl:flex items-center justify-center flex-1 gap-1 xl:gap-2 2xl:gap-3 px-2 overflow-hidden">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  className="relative text-sm font-medium text-white/70 hover:text-[#D4AF37] transition-colors duration-300 group whitespace-nowrap px-1.5 xl:px-2 py-1"
                >
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] bg-[#D4AF37] rounded-full transition-all duration-300 group-hover:w-full" />
                  <span className="absolute inset-0 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ boxShadow: "0 0 12px rgba(212,175,55,0.15)" }}
                  />
                </a>
              ))}
            </nav>

            {/* Right: Book Button (desktop) */}
            <div className="hidden xl:block shrink-0">
              <a
                href="/book"
                onClick={(e) => { e.preventDefault(); router.push("/book"); }}
                className="inline-flex items-center px-5 py-2.5 rounded-full border border-[#D4AF37] text-[#D4AF37] text-sm font-semibold tracking-wider transition-all duration-300 hover:bg-[#D4AF37] hover:text-[#0A0A0A] hover:shadow-lg hover:shadow-[rgba(212,175,55,0.25)]"
              >
                Book Consultation
              </a>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="xl:hidden p-2 text-[#D4AF37] hover:text-white transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-[rgba(25,16,35,0.98)] backdrop-blur-xl border-l border-[rgba(212,175,55,0.15)] shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-[rgba(212,175,55,0.15)]">
                <img
                  src="/images/logo.png"
                  alt="Mystic Yoga"
                  className="h-10 w-auto object-contain"
                />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-[#D4AF37]/70 hover:text-[#D4AF37] transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-80px)]">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link.href)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="flex items-center gap-2 px-4 py-3 text-base font-medium text-white/70 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-all"
                  >
                    {link.label}
                    <ChevronDown size={14} className="ml-auto -rotate-90 opacity-50" />
                  </motion.a>
                ))}
                <motion.a
                  href="/book"
                  onClick={(e) => { e.preventDefault(); setMobileOpen(false); router.push("/book"); }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="block mt-6 px-6 py-3 rounded-full border border-[#D4AF37] text-[#D4AF37] text-center text-sm font-semibold transition-all hover:bg-[#D4AF37] hover:text-[#0A0A0A]"
                >
                  Book Consultation
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
