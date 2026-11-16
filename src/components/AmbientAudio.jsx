import { Volume2, VolumeX } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { MEDIA } from '../config/media'

/* ───────────────────────────────────────────────────────────────────────────
 *  AMBIENT AUDIO CONFIG
 *  Exact filenames live in `src/config/media.js` (MEDIA.bgm) — swap them there.
 *  One track covers Crossroads, the Landmark Museum and the Night Market, so
 *  walking between them never restarts the music. The cinema is silent and the
 *  corner control mutes the film instead.
 * ─────────────────────────────────────────────────────────────────────────── */
const TRACK_SRC = MEDIA.bgm.main
const DEFAULT_VOLUME = MEDIA.bgm.volume
const BGM_SCENES = new Set(['crossroads', 'museum', 'nightmarket'])

export default function AmbientAudio({
  scene,
  volume = DEFAULT_VOLUME,
  onVolumeChange,
  muted = false,
  onToggleMute,
  cinemaMuted = false,
  onToggleCinemaMute,
}) {
  const audioRef = useRef(null)
  const target = useRef(0)
  const frame = useRef(0)
  const [blocked, setBlocked] = useState(false)

  const inCinema = !BGM_SCENES.has(scene)

  // Smoothly ease the track toward its target volume, then pause it.
  const tick = useCallback(function loop() {
    const audio = audioRef.current
    if (!audio) {
      frame.current = 0
      return
    }

    const goal = target.current
    const delta = goal - audio.volume

    if (Math.abs(delta) < 0.003) {
      audio.volume = goal
      if (goal === 0 && !audio.paused) audio.pause()
      frame.current = 0
      return
    }

    audio.volume = Math.min(1, Math.max(0, audio.volume + delta * 0.09))
    frame.current = requestAnimationFrame(loop)
  }, [])

  const kick = useCallback(() => {
    if (!frame.current) frame.current = requestAnimationFrame(tick)
  }, [tick])

  const attemptPlay = useCallback(() => {
    const audio = audioRef.current
    if (!audio || target.current <= 0 || !audio.paused) return

    const promise = audio.play()
    if (promise && typeof promise.then === 'function') {
      promise.then(() => setBlocked(false)).catch(() => setBlocked(true))
    }
  }, [])

  // Prepare the element once: loop forever, start silent.
  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      audio.loop = true
      audio.volume = 0
    }

    return () => {
      if (frame.current) cancelAnimationFrame(frame.current)
      frame.current = 0
      target.current = 0
      audio?.pause()
    }
  }, [])

  // Route the current scene and the chosen volume to the target.
  useEffect(() => {
    target.current = !inCinema && !muted ? volume : 0
    if (target.current > 0) attemptPlay()
    kick()
  }, [inCinema, muted, volume, attemptPlay, kick])

  // Browsers block audio until the first gesture. Retry on the first click,
  // tap or key press anywhere in the experience.
  useEffect(() => {
    const unlock = () => {
      if (target.current > 0) attemptPlay()
      kick()
    }

    window.addEventListener('pointerdown', unlock)
    window.addEventListener('touchstart', unlock, { passive: true })
    window.addEventListener('keydown', unlock)

    return () => {
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown', unlock)
    }
  }, [attemptPlay, kick])

  const level = muted ? 0 : volume
  const silent = level === 0
  const controlMuted = inCinema ? cinemaMuted : muted || silent

  // Dragging the slider to zero leaves the track silent but unmuted, so the
  // button restores the default level instead of doing nothing. Muting keeps
  // the chosen level, so unmuting returns to it.
  const handleToggle = () => {
    if (inCinema) {
      onToggleCinemaMute?.()
      return
    }
    if (volume <= 0) {
      onVolumeChange?.(DEFAULT_VOLUME)
      if (muted) onToggleMute?.()
      return
    }
    onToggleMute?.()
  }

  const handleVolume = (event) => {
    const next = Number(event.target.value)
    onVolumeChange?.(next)
    if (next > 0 && muted) onToggleMute?.()
  }

  const label = inCinema
    ? cinemaMuted
      ? 'Unmute movie audio'
      : 'Mute movie audio'
    : controlMuted
      ? 'Unmute ambient music'
      : 'Mute ambient music'

  return (
    <div className="pointer-events-none fixed inset-0 z-[54]">
      <audio ref={audioRef} src={TRACK_SRC} loop preload="metadata" />

      <div className="pointer-events-auto absolute right-3 top-3 flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-2 py-1.5 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:right-6 sm:top-6">
        <button
          type="button"
          onClick={handleToggle}
          aria-pressed={inCinema ? cinemaMuted : muted}
          aria-label={label}
          title={!inCinema && blocked && !muted ? 'Tap anywhere to start the music' : label}
          className="relative flex h-6 w-6 shrink-0 cursor-pointer items-center justify-center rounded-full text-white/60 outline-none transition-colors hover:text-white focus-visible:ring-2 focus-visible:ring-amber-200/70"
        >
          {controlMuted ? (
            <VolumeX size={13} strokeWidth={1.7} />
          ) : (
            <Volume2 size={13} strokeWidth={1.7} />
          )}
          {!inCinema && blocked && !muted ? (
            <span
              aria-hidden="true"
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 animate-pulse rounded-full bg-amber-300 shadow-[0_0_8px_rgba(253,230,138,0.9)]"
            />
          ) : null}
        </button>

        {inCinema ? null : (
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={level}
            onChange={handleVolume}
            aria-label="Ambient music volume"
            aria-valuetext={`${Math.round(level * 100)} percent`}
            className="bgm-slider w-14 sm:w-20"
            style={{ '--level': `${Math.round(level * 100)}%` }}
          />
        )}
      </div>

      <span aria-live="polite" className="sr-only">
        {inCinema
          ? cinemaMuted
            ? 'Movie audio muted.'
            : 'Movie audio on.'
          : muted
            ? 'Ambient music muted.'
            : blocked
              ? 'Ambient music is waiting for your first interaction.'
              : 'Ambient music playing.'}
      </span>
    </div>
  )
}
