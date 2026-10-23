"use client";

import {
  type MotionValue,
  motion,
  useMotionValueEvent,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { useState } from "react";
import { cabin, engine, form, hero, phases, site, TOTAL_FRAMES } from "@/data/carData";

type Props = { scrollYProgress: MotionValue<number> };

const FADE = 0.035;

/** Opacity + lift for a scroll window. The first phase starts visible, the last never fades out. */
function usePhase(p: MotionValue<number>, [start, end]: [number, number]) {
  const first = start === 0;
  const last = end === 1;
  const input = [start, start + FADE, end - FADE, end];
  const opacity = useTransform(p, input, [first ? 1 : 0, 1, 1, last ? 1 : 0]);
  const y = useTransform(p, input, [first ? 0 : 36, 0, 0, last ? 0 : -36]);
  return { opacity, y };
}

const pad = (n: number, len = 3) => String(n).padStart(len, "0");

/**
 * "Dumb" HUD overlay. Every visual state is derived from the scrollYProgress
 * it is handed, so it can never drift from the canvas.
 */
export function Experience({ scrollYProgress: p }: Props) {
  const veiled = usePhase(p, phases[0].range);
  const formPhase = usePhase(p, phases[1].range);
  const cabinPhase = usePhase(p, phases[2].range);
  const enginePhase = usePhase(p, phases[3].range);

  // Scrims sit behind whichever side the copy is on.
  const leftScrim = useTransform(p, [0.17, 0.22, 0.66, 0.71], [0, 1, 1, 0]);
  const rightScrim = useTransform(p, [0.68, 0.73], [0, 1]);

  const [active, setActive] = useState(0);
  useMotionValueEvent(p, "change", (v) => {
    const i = phases.findIndex((ph) => v < ph.range[1]);
    setActive(i === -1 ? phases.length - 1 : i);
  });

  const frame = useTransform(p, (v) => pad(Math.round(v * (TOTAL_FRAMES - 1)) + 1));
  const percent = useTransform(p, (v) => `${pad(Math.round(v * 100))}%`);
  const bar = useTransform(p, [0, 1], [0, 1]);

  // Playback rate relative to the source clip's real-time speed (8 s ≈ 1.00×).
  const velocity = useVelocity(p);
  const smooth = useSpring(velocity, { stiffness: 120, damping: 30 });
  const rate = useTransform(smooth, (v) => {
    const r = Math.min(9.99, Math.abs(v) * 8);
    const dir = v < -0.001 ? "←" : "→";
    return `${dir} ${r.toFixed(2)}× ${r < 0.05 ? "HOLD" : r < 1 ? "SLOW" : "FAST"}`;
  });

  const cue = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <div className="pointer-events-none absolute inset-0 z-10 select-none">
      {/* Edge vignettes keep the type legible over any frame. */}
      <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-night/80 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-night/90 to-transparent" />
      <motion.div
        style={{ opacity: leftScrim }}
        className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-night/85 via-night/35 to-transparent md:w-3/5"
      />
      <motion.div
        style={{ opacity: rightScrim }}
        className="absolute inset-y-0 right-0 w-full bg-gradient-to-l from-night/85 via-night/40 to-transparent md:w-3/5"
      />

      {/* ── HUD chrome ─────────────────────────────────────────────── */}
      <div className="absolute inset-x-0 top-20 flex items-start justify-between px-gutter font-mono text-hud uppercase text-cream/60 md:top-24">
        <p>
          <span className="text-gold">Sheet {phases[active].sheet}</span>
          <span className="text-cream/30"> / 04</span>
          <span className="hidden sm:inline"> · {phases[active].name}</span>
        </p>
        <div className="text-right">
          <p>
            FR <motion.span>{frame}</motion.span>
            <span className="text-cream/30"> / {TOTAL_FRAMES}</span>
          </p>
          <motion.p className="mt-1 text-cream/40">{rate}</motion.p>
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-5 px-gutter md:bottom-7">
        <div className="flex items-center gap-4 font-mono text-hud uppercase text-cream/50">
          <motion.span className="w-10 text-gold">{percent}</motion.span>
          <div className="relative h-px flex-1 bg-cream/15">
            <motion.div
              style={{ scaleX: bar }}
              className="absolute inset-0 origin-left bg-gradient-to-r from-burgundy-bright to-gold"
            />
            {phases.slice(1).map((ph) => (
              <span
                key={ph.id}
                className="absolute -top-1 h-2.5 w-px bg-cream/40"
                style={{ left: `${ph.range[0] * 100}%` }}
              />
            ))}
          </div>
          <span className="hidden sm:inline">{site.tagline}</span>
        </div>
      </div>

      {/* ── 0–20% Veiled ───────────────────────────────────────────── */}
      <motion.section
        style={veiled}
        aria-label="Introduction"
        className="absolute inset-0 px-gutter pt-28 md:pt-32"
      >
        <h1 className="font-display text-[clamp(2.4rem,9vw,8.75rem)] leading-[0.9] font-normal tracking-[0.02em] text-cream">
          {site.marque}
          <span className="block text-[0.42em] tracking-[0.5em] text-cream/80">GT</span>
        </h1>
        <p
          aria-hidden
          className="text-outline absolute top-52 right-gutter font-display text-[clamp(5rem,19vw,17rem)] leading-none md:top-20"
        >
          {hero.year}
        </p>
        <div className="absolute right-gutter bottom-28 max-w-xs text-right md:bottom-32 md:max-w-sm">
          <p className="font-display text-[clamp(1.1rem,2.4vw,2.1rem)] leading-tight uppercase">
            {hero.lines.map(([word, accent]) => (
              <span key={word} className="block">
                {word}{" "}
                <em className="font-serif text-[1.25em] normal-case text-gold">{accent}</em>
              </span>
            ))}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-cream/65">{hero.body}</p>
        </div>
        <motion.div
          style={{ opacity: cue }}
          className="absolute bottom-14 left-gutter flex items-center gap-3 font-mono text-hud uppercase text-cream/80 md:bottom-24 md:left-1/2 md:-translate-x-1/2"
        >
          <span className="size-2.5 animate-pulse-dot rounded-full bg-cream" />
          {hero.cue}
          <span className="relative ml-1 h-6 w-px overflow-hidden bg-cream/15">
            <span className="absolute inset-0 animate-cue bg-cream" />
          </span>
        </motion.div>
      </motion.section>

      {/* ── 20–45% The form ────────────────────────────────────────── */}
      <motion.section
        style={formPhase}
        aria-labelledby="form-title"
        className="absolute inset-x-0 bottom-24 px-gutter md:top-1/2 md:bottom-auto md:-translate-y-1/2"
      >
        <PhaseCopy id="form-title" {...form} />
      </motion.section>

      {/* ── 45–70% The cabin ───────────────────────────────────────── */}
      <motion.section
        style={cabinPhase}
        aria-labelledby="cabin-title"
        className="absolute inset-x-0 bottom-24 px-gutter md:top-1/2 md:bottom-auto md:-translate-y-1/2"
      >
        <PhaseCopy id="cabin-title" {...cabin} />
      </motion.section>

      {/* ── 70–100% The engine ─────────────────────────────────────── */}
      <motion.section
        style={enginePhase}
        aria-labelledby="engine-title"
        className="absolute inset-x-0 bottom-20 flex justify-end px-gutter md:top-1/2 md:bottom-auto md:-translate-y-1/2"
      >
        <div className="max-w-sm text-right">
          <p className="font-mono text-hud uppercase text-gold">{engine.eyebrow}</p>
          <h2
            id="engine-title"
            className="mt-3 font-display text-[clamp(1.4rem,3.4vw,3rem)] leading-[1.05] uppercase"
          >
            {engine.title[0]}
            <em className="block font-serif text-[1.2em] normal-case text-gold">
              {engine.title[1]}
            </em>
          </h2>
          <p className="mt-4 hidden text-sm leading-relaxed text-cream/65 sm:block">{engine.body}</p>
          <dl className="mt-5 ml-auto max-w-xs divide-y divide-cream/10 border-y border-cream/10 font-mono text-hud uppercase">
            {engine.specs.map((s) => (
              <div key={s.label} className="flex justify-between gap-6 py-2">
                <dt className="text-cream/45">{s.label}</dt>
                <dd className="text-cream">{s.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </motion.section>
    </div>
  );
}

function PhaseCopy({
  id,
  eyebrow,
  title,
  body,
  points,
}: {
  id: string;
  eyebrow: string;
  title: string[];
  body: string;
  points: { k: string; v: string }[];
}) {
  return (
    <div className="max-w-md">
      <p className="font-mono text-hud uppercase text-gold">{eyebrow}</p>
      <h2 id={id} className="mt-3 font-display text-[clamp(1.4rem,3.4vw,3rem)] leading-[1.05] uppercase">
        {title[0]}
        <em className="block font-serif text-[1.2em] normal-case text-gold">{title[1]}</em>
      </h2>
      <p className="mt-4 text-sm leading-relaxed text-cream/70">{body}</p>
      <ul className="mt-6 grid grid-cols-3 gap-4 border-t border-cream/10 pt-4">
        {points.map((pt) => (
          <li key={pt.v}>
            <span className="block font-display text-lg text-cream md:text-2xl">{pt.k}</span>
            <span className="mt-1 block font-mono text-[0.6rem] leading-snug tracking-[0.12em] text-cream/50 uppercase">
              {pt.v}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
