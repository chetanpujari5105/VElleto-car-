# VELLUTO GT · Coachbuilt Modena 1961

A scroll-driven showcase for a fictional coachbuilt V12 grand tourer. A 600vh sticky section scrubs a 240-frame canvas sequence: the cloth comes off, the camera moves past the flank, then the doors, bonnet and boot open. A HUD overlay changes phase with the same scroll value. Imagery was generated with Google Flow (Nano Banana Pro + Veo 3.1). See `PROMPTS.md` for every prompt and which outputs were kept.

**Live:** https://velluto-gt.vercel.app

## Run

```bash
npm install && npm run dev      # http://localhost:3000
npm run build                   # static export → out/ (postbuild strips public/source-*)
npm run lint
npx serve out                   # preview the static build
```

## Regenerate the frames

```bash
npm run frames                  # = scripts/extract-frames.sh public/source-video/final.mp4
```

This needs `ffmpeg` and `cwebp` (`brew install ffmpeg webp`). It writes the 1920w JPG set, the 1920w WebP set, the 960w mobile WebP set, the poster, `og.jpg` and the feature stills. It also updates `TOTAL_FRAMES` in `data/carData.ts`.

## Deploy (Vercel)

The project is linked to `velluto-gt` (`.vercel/`). Vercel builds it with `next build` (`output: "export"`).

```bash
npx vercel deploy               # preview
npx vercel deploy --prod        # production
```

`.vercelignore` keeps `reference/` and the raw Flow sources out of the upload. To host elsewhere, upload `out/` to any static host.

## Architecture (from the "Website One Shot" brief)

| File | Role |
| --- | --- |
| `app/page.tsx` | Orchestrator. Owns the single `useScroll` for the 600vh container and passes `scrollYProgress` down. |
| `components/ScrollCanvas.tsx` | "Dumb" canvas. Maps progress to a frame and draws it with a `devicePixelRatio` backing store. Loads the first 30 frames eagerly, then streams the rest coarse-to-fine. |
| `components/Experience.tsx` | "Dumb" HUD. Phases at 0–20% Veiled, 20–45% The form, 45–70% The cabin and 70–100% The engine, plus the sheet, frame, % and playback-speed readouts. |
| `components/Loader.tsx` | Holds the page until the eager frames are decoded. |
| `components/Navbar.tsx` | Fixed nav. Glass after 40px of scroll, with a mobile menu dialog (Esc closes it). |
| `components/SpecsGrid.tsx`, `Features.tsx`, `Commission.tsx`, `Footer.tsx` | The sections after the sequence. |
| `components/StaticHero.tsx` | `prefers-reduced-motion` version: a still poster with the same copy. Lenis is off in this mode. |
| `data/carData.ts` | All copy, the specs and `TOTAL_FRAMES`. |

Stack: Next.js 16 (App Router, static export), React 19, TypeScript, Tailwind v4 (`@theme` tokens in `app/globals.css`), Framer Motion 12, Lenis.

Note: page.tsx mirrors `useScroll`'s progress into a plain `MotionValue`. Framer Motion 12 hands scroll-linked opacity to the browser's native ScrollTimeline, and that drifted from the canvas. Keep the mirror.

## Manual steps

1. **Connect the form.** `components/Commission.tsx` validates on the client and shows a confirmation, but a static export has no server. Send the payload to Formspree, Resend or a Vercel Function at the marked line.
2. **Replace the placeholder address** `atelier@velluto.example` in `data/carData.ts`.
3. Optional: set `NEXT_PUBLIC_SITE_URL` in Vercel for absolute Open Graph URLs.
4. Flow's visible "Veo ✦" watermark is still in the bottom-right corner of the frames. It is Google's AI-disclosure mark and was left in on purpose.

VELLUTO is a fictional marque. The figures are illustrative. No code, copy or imagery from the reference template was used.
