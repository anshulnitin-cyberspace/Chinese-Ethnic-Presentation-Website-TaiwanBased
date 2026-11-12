# Formosa After Dark · 福爾摩沙之夜

An interactive, illustrated walk through a Taiwanese city at dusk. Navigate a painted crossroads with perspective floor arrows, step into an old cinema, browse a landmark museum of flip-card exhibits, and order from a glowing night-market stall through a Chinese Smart POS payment flow.

Built with React, Tailwind CSS, and Framer Motion.

## The experience

- **Crossroads** — three painted floor arrows (Cinema, Landmark Museum, and Night Market) with perspective, hover lift, and idle pulse.
- **Cinema** — a full-bleed animated film pinned onto the projection screen painted into the artwork, audience silhouettes, and a floor arrow back to the street.
- **Landmark Museum** — a glowing gallery hall with a central carousel of Taiwanese landmarks. Shuffle with the side arrows, then tap a card to flip it and read the bilingual museum label on the back. All exhibits come from `src/data/landmarks.js`.
- **Night Market** — lantern-lit stalls and a glowing QR sign. Tap the sign to run the scanner, then follow the payment flow.

### Night-market POS demo

The POS is mobile-first and fully interactive:

1. QR scan animation connects to stall A-17.
2. Skeleton loading resolves into a mock menu with categories and cart controls.
3. Review the order, choose dine-in or takeaway.
4. Pick Alipay, WeChat Pay, or UnionPay from the payment sheet.
5. Enter a 6-digit PIN. The demo PIN is **`123456`**.
6. On success, a receipt is shown and the app returns to the night market automatically.

The POS supports a Chinese/English toggle. Every payment is simulated; no real transactions occur.

## Tech stack

- React 19 + Vite 6
- Tailwind CSS 4
- Framer Motion 12
- lucide-react icons

## Getting started

```bash
npm install
npm run dev
```

Open the URL printed by Vite (usually `http://localhost:5173`).

Create a production build with:

```bash
npm run build
npm run preview
```

## Project structure

```text
src/
  App.jsx                    scene state, transitions, asset preloading
  scenes/                    Crossroads, Cinema, Museum, NightMarket
  components/
    FloorArrow.jsx           perspective floor navigation
    SceneFrame.jsx           cinematic scene transitions
    ScannerOverlay.jsx       QR scan animation
    pos/                     Smart POS overlay, payment sheet, copy
  lib/useCoverFrame.js       aligns overlays to object-cover artwork
  data/menu.js               mock night-market menu
  data/landmarks.js          editable landmark exhibits
public/scenes/               optimized scene artwork
public/landmarks/            hand-authored landmark illustrations
design/                      editable SVG sources for generated artwork
```

## Notes

- The scene artwork was normalized from the supplied source images into responsive, web-friendly variants under `public/scenes/` (800/1600/3200 px widths). The full-resolution sources remain in the project root.
- Menu photos are remote Unsplash images with emoji/gradient fallbacks.
- This is a design demo, not a production payment terminal.
