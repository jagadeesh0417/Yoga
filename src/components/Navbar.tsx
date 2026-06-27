"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

const navLinks = [
  { label: "Home", href: "/", section: false },
  { label: "About", href: "/about", section: false },
  { label: "Why Us", href: "/why-us", section: false },
  { label: "Benefits", href: "/benefits", section: false },
  { label: "Philosophy", href: "/philosophy", section: false },
  { label: "Services", href: "/services", section: false },
  { label: "Pricing", href: "/pricing", section: false },
  { label: "Shop", href: "/shop", section: false },
  { label: "Quantum Cure", href: "/quantum-cure", section: false },
  { label: "Quantum Health", href: "/quantum-health", section: false },
  { label: "Gallery", href: "/gallery", section: false },
  { label: "Testimonials", href: "/testimonials", section: false },
  { label: "Blog", href: "/blog", section: false },
  { label: "Training", href: "/training", section: false },
  { label: "Contact", href: "/contact", section: false },
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
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    link: (typeof navLinks)[0]
  ) => {
    e.preventDefault();
    setMobileOpen(false);

    if (link.section) {
      const id = link.href.replace("#", "");
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    } else {
      router.push(link.href);
    }
  };

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled
            ? "bg-wine/95 backdrop-blur-xl shadow-lg shadow-black/10"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                router.push("/");
              }}
              className="flex items-center gap-2"
            >
              <span className="font-serif text-xl md:text-2xl font-bold tracking-tight text-gradient-wine-purple">
                MYSTIC YOGA<small className="text-[0.45em] align-super">™</small>
              </span>
            </a>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link)}
                  className="relative px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors duration-200 group"
                >
                  {link.label}
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gold rounded-full transition-all duration-300 group-hover:w-4/5" />
                </a>
              ))}
              <a
                href="/book"
                className="ml-4 px-6 py-2.5 rounded-full bg-gradient-to-r from-wine to-purple text-white text-sm font-semibold transition-all duration-300 shadow-lg shadow-wine/20 hover:shadow-wine/30 hover:-translate-y-0.5"
              >
                Book Now
              </a>
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-white hover:text-gold transition-colors"
              aria-label="Open menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </nav>

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
              className="fixed top-0 right-0 bottom-0 z-50 w-72 max-w-[85vw] bg-wine/95 backdrop-blur-xl border-l border-white/10 shadow-2xl"
            >
              <div className="flex items-center justify-between p-4 border-b border-white/10">
                <span className="font-serif text-lg font-bold text-white">
                  MYSTIC YOGA<small className="text-[0.45em] align-super">™</small>
                </span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 text-white/70 hover:text-white transition-colors"
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
              <div className="p-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={(e) => handleNavClick(e, link)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-center gap-2 px-4 py-3 text-base font-medium text-white/70 hover:text-white hover:bg-white/5 rounded-lg transition-all"
                  >
                    {link.label}
                    <ChevronDown size={14} className="ml-auto -rotate-90 opacity-50" />
                  </motion.a>
                ))}
                <motion.a
                  href="/book"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="block mt-6 px-6 py-3 rounded-full bg-gradient-to-r from-wine to-purple text-white text-center text-sm font-semibold transition-all shadow-lg"
                >
                  Book Now
                </motion.a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
