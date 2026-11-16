/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  CENTRAL MEDIA CONFIG
 * ─────────────────────────────────────────────────────────────────────────────
 *  Landmark photos and music live in `public/media/` and ARE committed to git,
 *  so a clean clone (and Vercel) serves them with no extra setup.
 *
 *  The cinema reel is ~1 GB, which is over GitHub's 100 MB file limit. Keep it
 *  out of git and either:
 *    ▸ point `VITE_CINEMA_VIDEO_URL` at a hosted copy (`.env.production`), or
 *    ▸ drop `TaiwanCinema.mp4` in the project root for local dev — Vite serves
 *      it, and `vite.config.js` copies it into `dist/` for local builds.
 *
 *  ▸ Swap a filename on the right to point at a different source file.
 * ─────────────────────────────────────────────────────────────────────────────
 */
export const MEDIA = {
  // ── Cinema ────────────────────────────────────────────────────────────────
  cinema: {
    // Local fallback. Production can override it with VITE_CINEMA_VIDEO_URL.
    video: '/TaiwanCinema.mp4',
  },

  // ── Night Market ─────────────────────────────────────────────────────────
  nightMarket: {
    backgroundVideo: '/media/NightMarketBGVideo.mp4',
  },

  // ── Ambient background music ─────────────────────────────────────────────
  bgm: {
    main: '/media/BGM_MainScreenandMuseum.mp3', // ← every scene except the cinema
    volume: 0.12, // 12% — subtle atmosphere only
  },
}

/**
 * Landmark artwork. Each exhibit has a horizontal (desktop) and a vertical
 * (mobile) crop. The museum swaps between them at the `md` breakpoint (768px).
 */
export const LANDMARK_MEDIA = {
  taipei101: {
    desktopImage: '/media/Taipei101Horizontal.png',
    mobileImage: '/media/Taipei101Vertical.png',
  },
  jiufen: {
    desktopImage: '/media/jiufenhorizontal.png',
    mobileImage: '/media/jiufenvertical.png',
  },
  taroko: {
    desktopImage: '/media/tarokogorgehorizontal.png',
    mobileImage: '/media/tarokogorgevertical.png',
  },
  sunMoonLake: {
    desktopImage: '/media/sunmoonlakehorizontal.png',
    mobileImage: '/media/sunmoonlakevertical.png',
  },
  alishan: {
    desktopImage: '/media/alishanhorizontal.png',
    mobileImage: '/media/alishanvertical.png',
  },
  longshan: {
    desktopImage: '/media/longshantemplehorizontal.png',
    mobileImage: '/media/longshantemplevertical.png',
  },
}

/**
 * Files that stay in the project root (not `public/`) because they are too
 * large to commit. `vite.config.js` copies them into `dist/` after a build.
 */
export const ROOT_MEDIA_FILES = [MEDIA.cinema.video]
