# Formosa After Dark · 福爾摩沙之夜

An interactive, illustrated walk through a Taiwanese city at dusk. Navigate a painted crossroads with perspective floor arrows, step into an old cinema, and order from a glowing night-market stall through a Chinese Smart POS payment flow.

Built with React, Tailwind CSS, and Framer Motion.

## The experience

- **Crossroads** — three painted floor arrows (Cinema, Night Market, and a soon-to-open alley) with perspective, hover lift, and idle pulse.
- **Cinema** — a full-bleed animated film pinned onto the projection screen painted into the artwork, audience silhouettes, and a floor arrow back to the street.
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
  App.jsx                    scene state, transitions, ambient toast
  scenes/                    Crossroads, Cinema, NightMarket
  components/
    FloorArrow.jsx           perspective floor navigation
    SceneFrame.jsx           cinematic scene transitions
    ScannerOverlay.jsx       QR scan animation
    pos/                     Smart POS overlay, payment sheet, copy
  lib/useCoverFrame.js       aligns overlays to object-cover artwork
  data/menu.js               mock night-market menu
public/scenes/               optimized scene artwork
```

## Notes

- The scene artwork was normalized from the supplied source images into web-friendly formats under `public/scenes/`.
- Menu photos are remote Unsplash images with emoji/gradient fallbacks.
- This is a design demo, not a production payment terminal.
