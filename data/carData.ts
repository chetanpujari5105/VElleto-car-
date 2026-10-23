// Every line of copy on the page, plus the frame-sequence settings.
// VELLUTO GT is a fictional marque; all figures are illustrative.

// Written by scripts/extract-frames.sh — keep on one line.
export const TOTAL_FRAMES = 240;

export const sequence = {
  desktop: "/images/car-sequence-webp",
  desktopJpg: "/images/car-sequence",
  mobile: "/images/car-sequence-mobile",
  /** Frames loaded before the loading screen lifts; the rest stream in behind it. */
  eager: 30,
  poster: "/images/poster.jpg",
};

export const site = {
  name: "VELLUTO GT",
  marque: "VELLUTO",
  tagline: "Coachbuilt Modena 1961",
  description:
    "VELLUTO GT: a coachbuilt V12 grand tourer, hand-beaten in Modena in 1961. Twelve cars. Scroll to lift the sheet.",
  ogAlt: "A deep burgundy 1961 coachbuilt grand tourer in a dark stone hall",
  email: "atelier@velluto.example",
};

export const nav = [
  { label: "Form", href: "#the-form" },
  { label: "Cabin", href: "#the-cabin" },
  { label: "Engine", href: "#the-engine" },
  { label: "Specification", href: "#specification" },
];

export type Phase = {
  id: string;
  sheet: string;
  name: string;
  /** Scroll progress window inside the 600vh sequence, 0–1. */
  range: [number, number];
};

export const phases: Phase[] = [
  { id: "veiled", sheet: "01", name: "Veiled", range: [0, 0.2] },
  { id: "the-form", sheet: "02", name: "The form", range: [0.2, 0.45] },
  { id: "the-cabin", sheet: "03", name: "The cabin", range: [0.45, 0.7] },
  { id: "the-engine", sheet: "04", name: "The engine", range: [0.7, 1] },
];

export const hero = {
  year: "1961",
  lines: [
    ["Looks", "fast"],
    ["standing", "still"],
  ] as const,
  body: "Twelve bodies, beaten over ash bucks in a Modena workshop through the winter of 1961. This one has waited under its sheet ever since.",
  cue: "Drag to reveal",
};

export const form = {
  eyebrow: "02 — The form",
  title: ["Every curve", "beaten by hand"],
  body: "Each panel was shaped over a wooden buck with mallet and sandbag, then wheeled smooth until the light ran along it without a ripple. No two cars match to the millimetre. That was never the point.",
  points: [
    { k: "1,900 h", v: "of panel work per body" },
    { k: "72", v: "spokes in each wire wheel" },
    { k: "14", v: "coats of oxblood lacquer" },
  ],
};

export const cabin = {
  eyebrow: "03 — The cabin",
  title: ["Cream hide,", "nothing else"],
  body: "Two seats and a dashboard of brushed aluminium. Hides tanned slowly with oak bark, hand-stitched at eleven stitches to the inch, and a thin wooden wheel that tells you what the front tyres are doing.",
  points: [
    { k: "11", v: "stitches to the inch" },
    { k: "6", v: "dials, faced in cream enamel" },
    { k: "2", v: "seats. No apologies." },
  ],
};

export const engine = {
  eyebrow: "04 — The engine",
  title: ["Twelve cylinders,", "one voice"],
  body: "Bonnet up, the whole machine on show: a 60° V12 under three twin-choke carburettors, polished cam covers and a crackle-black sump.",
  specs: [
    { label: "Engine", value: "2,953 cc V12" },
    { label: "Power", value: "280 cv @ 7,000" },
    { label: "Torque", value: "294 Nm @ 5,500" },
    { label: "0–100 km/h", value: "6.4 s" },
    { label: "Top speed", value: "255 km/h" },
  ],
};

export const specsGrid = {
  eyebrow: "Specification",
  title: ["Numbers from", "another winter"],
  note: "Illustrative figures for a fictional car.",
  items: [
    { label: "Engine", value: "V12", detail: "60°, single overhead cam per bank" },
    { label: "Displacement", value: "2,953", unit: "cc", detail: "73 × 58.8 mm bore and stroke" },
    { label: "Power", value: "280", unit: "cv", detail: "at 7,000 rpm" },
    { label: "Gearbox", value: "4+OD", detail: "all-synchromesh, rear-mounted" },
    { label: "Dry weight", value: "1,040", unit: "kg", detail: "aluminium over a tubular frame" },
    { label: "0–100 km/h", value: "6.4", unit: "s", detail: "period road test, dry tarmac" },
    { label: "Top speed", value: "255", unit: "km/h", detail: "on the Modena–Bologna autostrada" },
    { label: "Built", value: "12", unit: "cars", detail: "1961–1962, numbered on the scuttle" },
  ],
};

export const features = {
  eyebrow: "Atelier",
  title: ["Coachbuilt,", "not manufactured"],
  items: [
    {
      n: "01",
      title: "The body",
      body: "Aluminium, 1.2 mm thick, rolled on an English wheel. Every seam is gas-welded and dressed flat by eye.",
      image: "/images/stills/form.jpg",
      alt: "Side profile of the burgundy grand tourer showing its long bonnet and chrome side vent",
    },
    {
      n: "02",
      title: "The wheels",
      body: "Seventy-two chrome spokes per wheel, laced and trued by one man, held on with a single knock-off spinner.",
      image: "/images/stills/wheel.jpg",
      alt: "Close view of a chrome wire-spoke wheel on the burgundy car",
    },
    {
      n: "03",
      title: "The cockpit",
      body: "A thin wooden wheel, six cream-faced dials and hides stitched by hand. The doors swing wide enough to step in without ducking.",
      image: "/images/stills/cockpit.jpg",
      alt: "Open driver's door revealing cream leather seats and a wooden-rimmed steering wheel",
    },
  ],
};

export const commission = {
  eyebrow: "Private viewing",
  title: ["The sheet comes off", "once a month"],
  body: "Car number seven is shown by appointment in Modena on the first Saturday of each month. Tell us a little about yourself and we will write back within two working days.",
  interests: ["Private viewing", "Commission enquiry", "Press & archive"],
  months: ["November", "December", "January", "February", "March"],
};

export const footer = {
  line: "A fictional marque, built for the screen.",
  credit: "Car imagery generated with Google Flow (Nano Banana Pro + Veo 3.1). Specifications are illustrative.",
};
