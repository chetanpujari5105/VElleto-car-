# VELLUTO GT: progress

Project folder: `Car webstie /velluto/`. The old Halvard site in the parent folder is untouched.
Flow project: flow.google.com/u/3/project/cbf06226-1233-40d9-8e04-406c8c3f896e (account naamkeengineers83).

- [x] Step 0: read docx + references (copied into `reference/`)
- [x] Step 1: Flow on the correct account (the user picked it on Google's account chooser)
- [x] Step 2: start frame (8 variations → B#4) and end frame (16 variations → batch 3 #4), in `public/source-frames/`
- [x] Step 3: Veo 3.1 Fast, frames-to-video, gen 1 kept (no morph, colour stable), 720p in `public/source-video/`
- [x] Step 3b: 1080p upscale → `public/source-video/final.mp4`
- [x] Step 4: `npm run frames` (ffmpeg 30 fps → JPG + WebP 1920 + WebP 960 mobile, TOTAL_FRAMES auto-updated)
- [x] Step 5: site built (Navbar, ScrollCanvas, Experience HUD, SpecsGrid, Features, Commission form, Footer, Lenis, reduced-motion poster, OG)
- [x] Step 6: build + lint pass. Checked desktop at all phases, 390px via an iframe harness, both scroll directions, drag scrub, form validation. No console errors. 240 frames, no blanks, no cuts (max frame diff 3.1 vs median 0.8).
- [x] Step 7: deployed to https://velluto-gt.vercel.app (Vercel project velluto-gt; the first deploy is auto-assigned to production). README and PROMPTS written.

## Open items
- Wire the Commission form to a real endpoint (static export, no server).
- Optional: regenerate with Veo 3.1 Quality for a crisper source (720p original → 1080p upscale has visible grain; WebP set is 37 MB).

## Notes
- framer-motion 12 hands useScroll-driven opacity to the native ScrollTimeline, which drifted. page.tsx mirrors progress into a plain MotionValue. Keep it that way.
- Flow downloads land in ~/Downloads. Programmatic multi-downloads get blocked, so use the tile ⋮ → Download menu.
