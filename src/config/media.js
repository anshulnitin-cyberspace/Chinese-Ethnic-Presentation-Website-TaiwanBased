/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL MEDIA CONFIG
 * ─────────────────────────────────────────────────────────────────────────────
 *  Drop the real files in the project ROOT (next to package.json) or in
 *  `public/`. Paths start with `/`, so Vite serves them from the site root in
 *  development and the build step copies the root files into `dist/`.
 *
 *  ▸ Swap a filename on the right to point at a different source file.
 *  ▸ `vite.config.js` reads MEDIA_FILES and copies each root file into dist
 *    (hard-link when possible) so production builds resolve the same URLs.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const MEDIA = {
  // ── Cinema ────────────────────────────────────────────────────────────────
  cinema: {
    video: '/TaiwanCinema.mp4', // ← the movie projected on the theatre screen
  },

  // ── Ambient background music ─────────────────────────────────────────────
  bgm: {
    main: '/BGM_MainScreenandMuseum.mp3', // ← Crossroads + Landmark Museum
    nightMarket: '/NightMarket.mp3', // ← Night Market
    volume: 0.12, // 12% — subtle atmosphere only
  },
}

/**
 * Landmark artwork. Each exhibit has a horizontal (desktop) and a vertical
 * (mobile) crop. The museum swaps between them at the `md` breakpoint (768px).
 */
export const LANDMARK_MEDIA = {
  taipei101: {
    desktopImage: '/Taipei101Horizontal.png',
    mobileImage: '/Taipei101Vertical.png',
  },
  jiufen: {
    desktopImage: '/jiufenhorizontal.png',
    mobileImage: '/jiufenvertical.png',
  },
  taroko: {
    desktopImage: '/tarokogorgehorizontal.png',
    mobileImage: '/tarokogorgevertical.png',
  },
  sunMoonLake: {
    desktopImage: '/sunmoonlakehorizontal.png',
    mobileImage: '/sunmoonlakevertical.png',
  },
  alishan: {
    desktopImage: '/alishanhorizontal.png',
    mobileImage: '/alishanvertical.png',
  },
  longshan: {
    desktopImage: '/longshantemplehorizontal.png',
    mobileImage: '/longshantemplevertical.png',
  },
}

/** Every root-relative file the production build must copy into `dist/`. */
export const MEDIA_FILES = [
  MEDIA.cinema.video,
  MEDIA.bgm.main,
  MEDIA.bgm.nightMarket,
  ...Object.values(LANDMARK_MEDIA).flatMap(({ desktopImage, mobileImage }) => [
    desktopImage,
    mobileImage,
  ]),
]
