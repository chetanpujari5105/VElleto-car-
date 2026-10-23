"use client";

import { useMotionValue, useMotionValueEvent, useReducedMotion, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Commission } from "@/components/Commission";
import { Experience } from "@/components/Experience";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Loader } from "@/components/Loader";
import { Navbar } from "@/components/Navbar";
import { ScrollCanvas } from "@/components/ScrollCanvas";
import { useLenis } from "@/components/SmoothScroll";
import { SpecsGrid } from "@/components/SpecsGrid";
import { StaticHero } from "@/components/StaticHero";
import { phases, sequence, TOTAL_FRAMES } from "@/data/carData";

type Source = { path: string; ext: "webp" | "jpg" };

function pickSource(): Source {
  const mobile = window.matchMedia("(max-width: 767px)").matches;
  const webp = document.createElement("canvas").toDataURL("image/webp").startsWith("data:image/webp");
  if (!webp) return { path: sequence.desktopJpg, ext: "jpg" };
  return { path: mobile ? sequence.mobile : sequence.desktop, ext: "webp" };
}

/**
 * Orchestrator. Owns the one useScroll for the 600vh sequence and hands the
 * same scrollYProgress to the canvas and the HUD, so they cannot desync.
 */
export default function Home() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  // Mirror into a plain MotionValue. framer-motion hands useScroll-derived
  // opacity to the browser's ScrollTimeline, which drifted from the canvas;
  // a mirrored value keeps every child on the exact same JS number.
  const scrollYProgress = useMotionValue(0);
  useMotionValueEvent(rawProgress, "change", (v) => scrollYProgress.set(v));
  const reduce = useReducedMotion();
  const lenis = useLenis();

  const [source, setSource] = useState<Source | null>(null);
  const [ready, setReady] = useState(false);
  const [loaded, setLoaded] = useState(0);

  useEffect(() => {
    // Chosen on the client only: the static HTML cannot know the viewport.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSource(pickSource());
  }, []);

  // Hold the page still while the loading screen is up.
  useEffect(() => {
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [lenis, ready]);

  // "Drag to reveal": a horizontal or vertical drag on the hall scrubs the sequence.
  const drag = useRef<{ x: number; y: number } | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    drag.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!drag.current) return;
    const dx = e.clientX - drag.current.x;
    const dy = e.clientY - drag.current.y;
    drag.current = { x: e.clientX, y: e.clientY };
    const delta = (Math.abs(dx) > Math.abs(dy) ? dx : -dy) * 3;
    if (lenis) lenis.scrollTo(lenis.targetScroll + delta, { lerp: 0.12 });
    else window.scrollBy(0, delta);
  };
  const endDrag = () => {
    drag.current = null;
  };

  const showLoader = !reduce && !ready;
  const eagerProgress = Math.min(1, loaded / sequence.eager);

  return (
    <main id="top" className="bg-night">
      <a
        href="#specification"
        className="sr-only z-[70] rounded bg-cream px-4 py-2 text-night focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip the film
      </a>
      <Loader visible={showLoader} progress={eagerProgress} />
      <Navbar />

      {reduce ? (
        <StaticHero />
      ) : (
        /* SCROLL SEQUENCE: locked for 600vh */
        <section ref={containerRef} aria-label="The car, revealed" className="relative h-[600vh]">
          {/* Nav anchors land a little inside each phase. */}
          {phases.slice(1).map((ph) => (
            <span
              key={ph.id}
              id={ph.id}
              aria-hidden
              className="absolute left-0 h-px w-px"
              style={{ top: `${(ph.range[0] + 0.05) * 500}vh` }}
            />
          ))}
          <div
            className="sticky top-0 h-svh w-full cursor-grab overflow-hidden bg-night active:cursor-grabbing"
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={endDrag}
            onPointerCancel={endDrag}
          >
            {source && (
              <ScrollCanvas
                scrollYProgress={scrollYProgress}
                totalFrames={TOTAL_FRAMES}
                imageFolderPath={source.path}
                extension={source.ext}
                eager={sequence.eager}
                onProgress={setLoaded}
                onReady={() => setReady(true)}
              />
            )}
            <Experience scrollYProgress={scrollYProgress} />
          </div>
        </section>
      )}

      {/* REST OF SITE: scrolls naturally after the sequence */}
      <div className="relative z-20 bg-night">
        <SpecsGrid />
        <Features />
        <Commission />
        <Footer />
      </div>
    </main>
  );
}
