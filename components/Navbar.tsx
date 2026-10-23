"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { nav, site } from "@/data/carData";

export function Navbar() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 40));

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 border-b transition-[background-color,border-color,backdrop-filter] duration-500",
        scrolled || open
          ? "border-cream/10 bg-night/75 backdrop-blur-xl backdrop-saturate-150"
          : "border-transparent bg-transparent",
      )}
    >
      <nav
        aria-label="Primary"
        className="flex h-16 items-center justify-between gap-6 px-gutter md:h-[4.5rem]"
      >
        <a href="#top" className="flex items-center gap-3" aria-label={`${site.name}, back to top`}>
          <Mark />
          <span className="font-display text-[0.8rem] tracking-[0.35em] text-cream">{site.marque}</span>
          <span className="hidden font-mono text-hud text-cream/40 uppercase lg:inline">
            {site.tagline}
          </span>
        </a>

        <ul className="hidden items-center gap-8 font-mono text-hud uppercase md:flex">
          {nav.map((item) => (
            <li key={item.href}>
              <a href={item.href} className="text-cream/65 transition-colors hover:text-cream">
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-3">
          <a
            href="#commission"
            className="group hidden items-center gap-2 rounded-full border border-gold/50 px-5 py-2.5 font-mono text-hud text-gold uppercase transition-colors hover:bg-gold hover:text-night sm:inline-flex"
          >
            Private viewing
            <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            className="relative grid size-10 place-items-center md:hidden"
          >
            <span
              className={cn(
                "absolute h-px w-6 bg-cream transition-transform duration-300",
                open ? "rotate-45" : "-translate-y-1",
              )}
            />
            <span
              className={cn(
                "absolute h-px w-6 bg-cream transition-transform duration-300",
                open ? "-rotate-45" : "translate-y-1",
              )}
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="h-[calc(100dvh-4rem)] border-t border-cream/10 bg-night/95 px-gutter pt-10 backdrop-blur-xl md:hidden"
          >
            <ul className="space-y-6">
              {[...nav, { label: "Private viewing", href: "#commission" }].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + i * 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-baseline justify-between border-b border-cream/10 pb-4 font-display text-xl uppercase"
                  >
                    {item.label}
                    <span className="font-mono text-hud text-gold">0{i + 1}</span>
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

function Mark() {
  return (
    <svg viewBox="0 0 32 32" className="size-7" aria-hidden>
      <circle cx="16" cy="16" r="15" fill="none" stroke="var(--color-gold)" strokeWidth="1" />
      <path d="M8.5 10 16 23l7.5-13" fill="none" stroke="var(--color-cream)" strokeWidth="1.4" />
      <path d="M12 10h8" stroke="var(--color-burgundy-bright)" strokeWidth="1.4" />
    </svg>
  );
}
