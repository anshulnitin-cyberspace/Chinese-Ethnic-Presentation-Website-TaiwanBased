import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MEDIA } from '../config/media'

/* ───────────────────────────────────────────────────────────────────────────
 *  AMBIENT AUDIO CONFIG
 *  Exact filenames live in `src/config/media.js` (MEDIA.bgm) — swap them there.
 *  Tracks are looped and mixed down to a very low ambient level (12%).
 * ─────────────────────────────────────────────────────────────────────────── */
const TRACK_SRC = {
  main: MEDIA.bgm.main, // Crossroads + Landmark Museum
  night: MEDIA.bgm.nightMarket, // Night Market
}

/** Which track should be audible in each scene (null = silence). */
const SCENE_TRACK = {
  crossroads: 'main',
  museum: 'main',
  nightmarket: 'night',
  cinema: null,
}

const VOLUME = MEDIA.bgm.volume

const TRACKS = ['main', 'night']

/**
 * One persistent <audio> element per track. Scenes only move their volume
 * targets, so Crossroads -> Museum never restarts the main theme; the night
 * market crossfades over it and back.
 */
export default function AmbientAudio({ scene }) {
  const mainRef = useRef(null)
  const nightRef = useRef(null)
  const [muted, setMuted] = useState(false)
  const [blocked, setBlocked] = useState(false)

  const state = useRef({
    targets: { main: 0, night: 0 },
    frame: 0,
  })

  const audioFor = useCallback(
    (id) => (id === 'main' ? mainRef.current : nightRef.current),
    [],
  )

  // Smoothly ease every track toward its target volume, then pause silent
  // tracks. ~0.9s to fade fully in or out.
  const tick = useCallback(function loop() {
    const ref = state.current
    let busy = false

    for (const id of TRACKS) {
      const audio = audioFor(id)
      if (!audio) continue
      const target = ref.targets[id]
      const delta = target - audio.volume

      if (Math.abs(delta) < 0.003) {
        audio.volume = target
        if (target === 0 && !audio.paused) audio.pause()
      } else {
        audio.volume = Math.min(1, Math.max(0, audio.volume + delta * 0.09))
        busy = true
      }
    }

    ref.frame = busy ? requestAnimationFrame(loop) : 0
  }, [audioFor])

  const attemptPlay = useCallback((audio) => {
    if (!audio) return
    const promise = audio.play()
    if (promise && typeof promise.then === 'function') {
      promise.then(() => setBlocked(false)).catch(() => setBlocked(true))
    }
  }, [])

  const applyTargets = useCallback(
    (targets) => {
      const ref = state.current
      ref.targets = targets

      for (const id of TRACKS) {
        const audio = audioFor(id)
        if (audio && targets[id] > 0 && audio.paused) attemptPlay(audio)
      }

      if (!ref.frame) ref.frame = requestAnimationFrame(tick)
    },
    [audioFor, attemptPlay, tick],
  )

  // Prepare the elements once: loop forever, start silent.
  useEffect(() => {
    const elements = [mainRef.current, nightRef.current]
    elements.forEach((audio) => {
      if (!audio) return
      audio.loop = true
      audio.volume = 0
    })

    return () => {
      const ref = state.current
      if (ref.frame) cancelAnimationFrame(ref.frame)
      ref.frame = 0
      ref.targets = { main: 0, night: 0 }
      elements.forEach((audio) => audio?.pause())
    }
  }, [])

  // Route the current scene to its track. Crossroads and Museum share `main`,
  // so the volume target does not change and the theme keeps playing.
  useEffect(() => {
    const track = SCENE_TRACK[scene] ?? null
    applyTargets({
      main: !muted && track === 'main' ? VOLUME : 0,
      night: !muted && track === 'night' ? VOLUME : 0,
    })
  }, [scene, muted, applyTargets])

  // Browsers block audio until the first gesture. Retry on the first click,
  // tap or key press anywhere in the experience.
  useEffect(() => {
    const unlock = () => {
      const ref = state.current
      for (const id of TRACKS) {
        const audio = audioFor(id)
        if (audio && ref.targets[id] > 0 && audio.paused) attemptPlay(audio)
      }
      if (!ref.frame) ref.frame = requestAnimationFrame(tick)
    }

    window.addEventListener('pointerdown', unlock)
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock)

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [attemptPlay, audioFor, tick])

  const label = muted ? 'Unmute ambient music' : 'Mute ambient music'

  return (
    <div className="pointer-events-none fixed inset-0 z-[54]">
      <audio ref={mainRef} src={TRACK_SRC.main} loop preload="metadata" />
      <audio ref={nightRef} src={TRACK_SRC.night} loop preload="metadata" />

      <button
        type="button"
        onClick={() => setMuted((value) => !value)}
        aria-pressed={muted}
        aria-label={label}
        title={blocked && !muted ? 'Tap anywhere to start the music' : label}
        className="group pointer-events-auto absolute bottom-4 right-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-white/15 bg-black/35 text-white/55 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md outline-none transition-colors hover:border-white/40 hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200/70 sm:bottom-6 sm:right-6 sm:h-9 sm:w-9"
      >
        {muted ? (
          <VolumeX size={13} strokeWidth={1.7} />
        ) : (
          <Volume2 size={13} strokeWidth={1.7} />
        )}
        {blocked && !muted ? (
          <span
            aria-hidden="true"
            className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300 shadow-[0_0_8px_rgba(253,230,138,0.9)]"
          />
        ) : null}
      </button>

      <span aria-live="polite" className="sr-only">
        {muted
          ? 'Ambient music muted.'
          : blocked
            ? 'Ambient music is waiting for your first interaction.'
            : 'Ambient music playing.'}
      </span>
    </div>
  )
}
