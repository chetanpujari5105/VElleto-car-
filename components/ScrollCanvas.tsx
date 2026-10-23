"use client";

import { type MotionValue, useMotionValueEvent } from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

type Props = {
  scrollYProgress: MotionValue<number>;
  totalFrames: number;
  imageFolderPath: string;
  extension: "webp" | "jpg";
  /** How many frames must load before onReady fires. */
  eager: number;
  onProgress?: (loaded: number, total: number) => void;
  onReady?: () => void;
};

/**
 * "Dumb" renderer: maps scrollYProgress (0–1) to a frame and paints it on a
 * devicePixelRatio-scaled canvas. Owns no scroll state of its own.
 */
export function ScrollCanvas({
  scrollYProgress,
  totalFrames,
  imageFolderPath,
  extension,
  eager,
  onProgress,
  onReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const images = useRef<(HTMLImageElement | null)[]>([]);
  const drawn = useRef(-1);
  const raf = useRef(0);

  // Callbacks change identity every render; keep the latest without re-running the loader.
  const cb = useRef({ onProgress, onReady });
  useEffect(() => {
    cb.current = { onProgress, onReady };
  });

  const nearestLoaded = useCallback((index: number) => {
    const list = images.current;
    for (let d = 0; d < list.length; d++) {
      if (list[index - d]) return list[index - d];
      if (list[index + d]) return list[index + d];
    }
    return null;
  }, []);

  const draw = useCallback(
    (force = false) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const index = Math.min(
        totalFrames - 1,
        Math.max(0, Math.round(scrollYProgress.get() * (totalFrames - 1))),
      );
      const img = nearestLoaded(index);
      if (!img) return;
      const key = images.current.indexOf(img);
      if (!force && key === drawn.current) return;
      drawn.current = key;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      const ir = img.naturalWidth / img.naturalHeight;

      let dw: number;
      let dh: number;
      if (w / h >= 1.1) {
        // Landscape: cover, so the hall fills the screen edge to edge.
        const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
        dw = img.naturalWidth * scale;
        dh = img.naturalHeight * scale;
      } else {
        // Portrait: keep the whole car in view, slightly wider than the screen.
        dw = w * 1.55;
        dh = dw / ir;
      }
      const dx = (w - dw) / 2;
      const dy = w / h >= 1.1 ? (h - dh) / 2 : h * 0.42 - dh / 2;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, dx, dy, dw, dh);

      if (w / h < 1.1) {
        // Portrait: feather the band's top and bottom edges into the page.
        const fade = Math.min(90, dh * 0.22);
        const top = ctx.createLinearGradient(0, dy, 0, dy + fade);
        top.addColorStop(0, "rgb(13 10 9)");
        top.addColorStop(1, "rgb(13 10 9 / 0)");
        ctx.fillStyle = top;
        ctx.fillRect(0, dy - 1, w, fade + 1);
        const bottom = ctx.createLinearGradient(0, dy + dh - fade, 0, dy + dh);
        bottom.addColorStop(0, "rgb(13 10 9 / 0)");
        bottom.addColorStop(1, "rgb(13 10 9)");
        ctx.fillStyle = bottom;
        ctx.fillRect(0, dy + dh - fade, w, fade + 1);
      }
    },
    [nearestLoaded, scrollYProgress, totalFrames],
  );

  // High-DPI sizing: backing store = CSS size × devicePixelRatio.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2.5);
      canvas.width = Math.round(canvas.clientWidth * dpr);
      canvas.height = Math.round(canvas.clientHeight * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.imageSmoothingQuality = "high";
      }
      draw(true);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    return () => ro.disconnect();
  }, [draw]);

  // Progressive loader: first `eager` frames in order, then the rest in a
  // coarse-to-fine stride so every scroll position has a close frame early.
  useEffect(() => {
    let cancelled = false;
    images.current = new Array(totalFrames).fill(null);
    drawn.current = -1;
    let loaded = 0;
    let readyFired = false;

    const load = (i: number) =>
      new Promise<void>((resolve) => {
        const img = new Image();
        img.decoding = "async";
        img.src = `${imageFolderPath}/${i + 1}.${extension}`;
        const done = () => {
          if (cancelled) return resolve();
          if (img.naturalWidth) images.current[i] = img;
          loaded++;
          cb.current.onProgress?.(loaded, totalFrames);
          if (!readyFired && loaded >= Math.min(eager, totalFrames)) {
            readyFired = true;
            cb.current.onReady?.();
          }
          draw(true);
          resolve();
        };
        img.onload = () => img.decode().catch(() => {}).finally(done);
        img.onerror = done;
      });

    const order: number[] = [];
    const seen = new Set<number>();
    const push = (i: number) => {
      if (i < totalFrames && !seen.has(i)) {
        seen.add(i);
        order.push(i);
      }
    };
    for (let i = 0; i < Math.min(eager, totalFrames); i++) push(i);
    for (const stride of [16, 8, 4, 2, 1]) for (let i = 0; i < totalFrames; i += stride) push(i);

    const eagerSet = order.slice(0, eager);
    const rest = order.slice(eager);

    (async () => {
      await Promise.all(eagerSet.map(load));
      const workers = Array.from({ length: 6 }, async () => {
        while (!cancelled && rest.length) await load(rest.shift()!);
      });
      await Promise.all(workers);
    })();

    return () => {
      cancelled = true;
    };
  }, [draw, eager, extension, imageFolderPath, totalFrames]);

  useMotionValueEvent(scrollYProgress, "change", () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => draw());
  });

  return <canvas ref={canvasRef} className="absolute inset-0 z-0 h-full w-full" aria-hidden />;
}
