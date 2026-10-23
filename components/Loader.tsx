"use client";

import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/carData";

type Props = { visible: boolean; progress: number };

/** Holds the page until the first frames are decoded, so the canvas never flashes empty. */
export function Loader({ visible, progress }: Props) {
  const pct = Math.round(progress * 100);
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          role="status"
          aria-live="polite"
          aria-label={`Loading, ${pct} percent`}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[60] grid place-items-center bg-night"
        >
          <div className="w-[min(78vw,22rem)] text-center">
            <p className="font-display text-sm tracking-[0.6em] text-cream">{site.marque}</p>
            <p className="mt-2 font-serif text-lg text-gold italic">lifting the sheet</p>
            <div className="mt-8 h-px w-full bg-cream/10">
              <div
                className="h-full origin-left bg-gradient-to-r from-burgundy-bright to-gold transition-transform duration-300"
                style={{ transform: `scaleX(${progress})` }}
              />
            </div>
            <p className="mt-3 flex justify-between font-mono text-hud text-cream/45 uppercase">
              <span>Preparing the hall</span>
              <span className="text-cream/80">{String(pct).padStart(3, "0")}%</span>
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
