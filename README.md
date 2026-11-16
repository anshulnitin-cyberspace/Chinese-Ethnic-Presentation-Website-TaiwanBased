# Formosa After Dark · 福爾摩沙之夜

An interactive, illustrated walk through a Taiwanese city at dusk. Navigate a painted crossroads with perspective floor arrows, step into an old cinema, browse a landmark museum of flip-card exhibits, and order from a glowing night-market stall through a Chinese Smart POS payment flow.

Built with React, Tailwind CSS, and Framer Motion.

## The experience

- **Crossroads** — three painted floor arrows (Cinema, Landmark Museum, and Night Market) with perspective, hover lift, and idle pulse.
- **Cinema** — a real local film projected on a responsive 16:9 theatre screen. The reel waits on a stylized “Start Movie” card, then plays with diegetic controls (play/pause, ±10s, seek bar) that fade away while the film runs. Audience silhouettes scale with the viewport, and the background music stops here so it never fights the movie.
- **Landmark Museum** — a glowing gallery hall with a central carousel of Taiwanese landmarks. Shuffle with the side arrows, then tap a card to flip it and read the bilingual museum label on the back. Each exhibit shows a portrait photo on phones and a landscape photo on desktop (`<picture>` swaps at 768px). All exhibits come from `src/data/landmarks.js`.
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

## Media & ambient audio

Every large asset is configured in one place: **`src/config/media.js`**.

```js
MEDIA.cinema.video        '/TaiwanCinema.mp4'              // theatre reel
MEDIA.bgm.main            '/BGM_MainScreenandMuseum.mp3'   // Crossroads + Museum
MEDIA.bgm.nightMarket     '/NightMarket.mp3'               // Night Market
MEDIA.bgm.volume          0.12                             // 12% ambient level
LANDMARK_MEDIA.<place>    desktopImage / mobileImage       // per-orientation crops
```

- Put the real files in the **project root** (next to `package.json`) or in `public/`. Paths start with `/`.
- Vite serves root files in `npm run dev`. `npm run build` also copies every file in `MEDIA_FILES` into `dist/` (hard link when possible, otherwise a copy), so the same URLs work in production. Missing files only produce a build warning.
- The media files are intentionally **not committed** (the movie alone is about 1 GB). Keep them next to the project and deploy them alongside `dist/`.
- Music is looped at `0.12` volume. Crossroads and Museum share one track, so walking between them never restarts it; the Night Market crossfades to its own theme; the Cinema fades both out. Playback starts on the first click or tap if the browser blocks autoplay. The small sound button in the bottom-right corner mutes/unmutes everything.
- Landmark exhibits show `mobileImage` (portrait, 3:4 card) below 768 px and `desktopImage` (landscape, 16:10 card) from 768 px up. `focalDesktop` / `focalMobile` tune each crop.

## Project structure

```text
src/
  App.jsx                    scene state, transitions, asset preloading
  scenes/                    Crossroads, Cinema, Museum, NightMarket
  components/
    AmbientAudio.jsx         scene-routed BGM manager + mute toggle
    FloorArrow.jsx           perspective floor navigation
    SceneFrame.jsx           cinematic scene transitions
    ScannerOverlay.jsx       QR scan animation
    pos/                     Smart POS overlay, payment sheet, copy
  config/media.js            video, BGM and landmark image paths
  data/menu.js               mock night-market menu
  data/landmarks.js          editable landmark exhibits (both orientations)
public/scenes/               optimized scene artwork
public/landmarks/            legacy hand-authored landmark illustrations
design/                      editable SVG sources for generated artwork
```

## Notes

- The scene artwork was normalized from the supplied source images into responsive, web-friendly variants under `public/scenes/` (800/1600/3200 px widths). The full-resolution sources remain in the project root.
- Menu photos are remote Unsplash images with emoji/gradient fallbacks.
- This is a design demo, not a production payment terminal.
