# Prompts log

All imagery was generated in **Google Flow** (project "Vintage Burgundy Italian…", account naamkeengineers83, 23 Oct 2026) through Flow's built-in agent panel.

- Images: **Nano Banana Pro**, 16:9, 4 outputs per prompt, downloaded as 2K upscales (2752×1536).
- Video: **Veo 3.1 – Fast**, frames to video, 16:9, 8 s, downloaded at 720p original and 1080p upscale.

No screenshot from the paid reference template was uploaded. The start frame was made from text only. The end frame used **one** reference: our own chosen start frame.

---

## Start frame (front ¾, cloth on)

### Batch A (4 images): text only

> Photoreal cinematic automotive photograph. A deep burgundy, dark cherry-red candy-gloss 1961 Italian coachbuilt two-door fastback grand tourer: long bonnet, short tail, rounded fastback roofline, chrome wire-spoke wheels with knock-off spinners, slim chrome bumpers and window trim, round headlamps, small oval grille, a chrome-edged horizontal side vent behind the front wheel, round red tail lamps, cream tan leather interior. The car stands in the centre of a vast dark stone hall with tall rough stone pillars, warm amber uplights glowing at the base of the walls, and a polished wet-look dark concrete floor with clear mirror reflections of the car. Low camera at headlight height, front three-quarter view showing the front and the left flank, the nose points toward the left of the frame, 35mm lens, the whole car in frame with space around it. A cream natural linen dust cloth is loosely draped over the roof and rear deck, falling in soft heavy folds over the rear fender onto the floor; the bonnet, grille and front wheels are uncovered. Moody high-contrast lighting, metallic glints on the chrome and wire wheels. No text, no logos, no badges, no people.

Result: good colour and wheels. #1 had a door badge, and the cars sat off-centre. Previews are in `public/source-frames/candidates/velluto-start-{1..4}.webp`; the 2K of #1 is `start-candidate-a2.jpg`.

### Batch B (4 images): same prompt plus

> …the car is centred in a symmetrical hall with stone pillars and warm uplights on both sides; the grille, bonnet, doors and wings carry no emblem, no badge and no lettering of any kind; the car fills about half the frame width.

**Kept: B #4**, "Car parked in stone hall", saved as `public/source-frames/start.jpg`. It has the centred car, a symmetrical hall and room to orbit. Rejected: B #1 and #3 (car off-centre) and B #2 (cropped too tight).

---

## End frame (rear ¾, cloth gone, doors / boot / bonnet open)

The reference for every batch was `start.jpg` only.

### Batch 1

> Keep EXACTLY the same car (same deep burgundy candy-gloss paint, same chrome wire-spoke wheels, same chrome bumpers and trim, same cream tan leather interior, same body shape), the same dark stone hall with the same pillars and warm amber uplights, the same polished wet-look floor with reflections, the same lens and lighting. Change only this: the camera has orbited along the car's left flank to a dramatic low rear three-quarter view, showing the rear and the same left flank, the tail and round red tail lamps on the right of the frame, the nose pointing away to the left. The cream linen cloth is gone. Both doors are open wide, the boot lid is lifted open, and the long front bonnet is raised high, tilted fully forward, so the engine bay is exposed: a polished V12 with ribbed aluminium cam covers, triple twin-choke carburettors and chrome air horns visible above the front wings. Whole car in frame. Photoreal, moody high-contrast lighting, metallic glints on chrome. No text, no logos, no badges, no people.

Result: the car, colour and hall matched, but the engine was hidden. #4 was mirrored (tail on the left), so it was rejected.

### Batch 2: camera raised over the roof to show the engine

> …raise the camera to just above roof height, looking down slightly, so we look over the roof into the open engine bay at the front…

Result: the engine was visible, but the shots were near bird's-eye. That breaks "same camera" and would be too big a jump for Veo, so all four were rejected.

### Batch 3: eye level

> Camera at standing eye level, about 1.5 m high, only slightly above the roofline and level with the horizon, the same distance and 35mm lens as the reference so the car fills about half the frame width and the floor reflections and the pillars look the same. Bonnet raised high showing the top of the polished V12 with ribbed cam covers and carburettors, both doors open wide, boot lid open, no cloth.

**Kept: batch 3 #4**, "Classic car with open doors", saved as `public/source-frames/end.jpg`. Rejected: #2 (mirrored) and #1 and #3 (car off-centre).

### Batch 4: edit pass on the kept end frame (not used)

> Edit the attached image only… Only change the engine bay under the raised bonnet: add a warm work light inside it so the polished V12 engine is clearly visible…

Result: the model lit the boot, not the engine bay. All four were rejected and the unedited batch 3 #4 was kept.

---

## Video (Veo 3.1 – Fast, frames to video)

First frame = `start.jpg`, last frame = `end.jpg`, 16:9, 8 s.

> A photorealistic, continuous cinematic shot of a deep burgundy 1961 coachbuilt grand tourer in a dark stone hall with warm uplights and a polished wet-look floor. The camera starts low at a front three-quarter angle with a cream linen cloth draping the car. Without cutting, the cloth is pulled away and the camera performs a slow sweeping orbit along the flank, past the side profile, to a dramatic low rear three-quarter angle. Then the bonnet and doors lift open and the engine bay is revealed with rigid mechanical precision. No morphing, no warping, the car keeps the same colour and shape in every frame. Moody, high-contrast lighting with metallic glints on chrome and wire wheels.

**Generation 1: kept.** The cloth slides off, the camera tracks past the side profile to the rear ¾, then the doors, bonnet and boot open. Colour, wire wheels and chrome stay consistent in every frame, with no morphing, and it lands on the end frame. One 8 s clip covered the whole story, so no chaining was needed.

- `public/source-video/clip1-720p.mp4`: original, 1280×720, 24 fps
- `public/source-video/final.mp4`: 1080p upscale, the source for frame extraction

Flow's visible "Veo ✦" watermark (bottom-right) was left intact on purpose.
