import { AnimatePresence, motion } from 'framer-motion'
import { Clapperboard, Pause, Play, RotateCcw, RotateCw } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import FloorArrow from '../components/FloorArrow'
import { SceneCaption } from '../components/SceneCaption'
import { MEDIA } from '../config/media'

/* ───────────────────────────────────────────────────────────────────────────
 *  CINEMA MEDIA CONFIG
 *  The movie file lives in the project root; its path is defined once in
 *  `src/config/media.js` (MEDIA.cinema.video). Swap the filename there.
 * ─────────────────────────────────────────────────────────────────────────── */
const FILM_SRC = MEDIA.cinema.video

const EASE = [0.22, 1, 0.36, 1]

// A row of silhouetted heads, spread across the width. Percentages keep the
// audience proportional on every viewport instead of overflowing the scene.
const HEADS = Array.from({ length: 15 }, (_, index) => {
  const spread = index / 14
  return {
    id: index,
    x: 3 + spread * 94,
    width: 7.4 + (index % 3) * 1.4 + (index % 2 ? 0.9 : 0),
    lift: (index % 4) * 1.6,
    opacity: 0.68 + (index % 4) * 0.075,
    blur: index % 5 === 0 ? 1.6 : 0,
  }
})

function formatTime(value) {
  if (!Number.isFinite(value) || value < 0) return '0:00'
  const total = Math.floor(value)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${String(seconds).padStart(2, '0')}`
}

function Audience() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[28%]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#040306] via-[#040306]/88 to-transparent" />

      <div className="absolute inset-0">
        {HEADS.map((head) => (
          <div
            key={head.id}
            className="absolute bottom-0"
            style={{
              left: `${head.x}%`,
              width: `${head.width}%`,
              transform: `translateX(-50%) translateY(${head.lift}%)`,
              opacity: head.opacity,
              filter: head.blur ? `blur(${head.blur}px)` : undefined,
            }}
          >
            <div
              className="mx-auto aspect-square w-[62%] rounded-full bg-[#060509]"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255,206,150,0.16), 0 -3px 14px rgba(255,176,106,0.07)',
              }}
            />
            <div
              className="mx-auto -mt-[3%] h-[clamp(30px,5.5vh,74px)] rounded-t-[999px] bg-[#060509]"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,206,150,0.1)' }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-0 h-[30%] bg-[#040306]" />
    </div>
  )
}

function ControlButton({ label, onClick, primary = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className={`flex shrink-0 cursor-pointer items-center justify-center rounded-full border outline-none transition-colors focus-visible:ring-2 focus-visible:ring-amber-200/80 ${
        primary
          ? 'h-8 w-8 border-amber-100/40 bg-amber-50/12 text-amber-50 hover:bg-amber-50/22 sm:h-9 sm:w-9'
          : 'h-7 w-7 border-white/15 bg-black/35 text-white/70 hover:border-white/35 hover:text-white sm:h-8 sm:w-8'
      }`}
    >
      {children}
    </button>
  )
}

function StartOverlay({ onStart, replay }) {
  return (
    <motion.button
      type="button"
      onClick={onStart}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.55, ease: EASE }}
      className="group absolute inset-0 z-30 flex cursor-pointer flex-col items-center justify-center gap-2 bg-[radial-gradient(ellipse_at_center,rgba(16,9,13,0.4),rgba(3,2,5,0.8))] backdrop-blur-[1.5px]"
    >
      <span className="relative flex h-12 w-12 items-center justify-center sm:h-16 sm:w-16">
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full border border-dashed border-amber-100/30"
          animate={{ rotate: 360 }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
        />
        <span
          aria-hidden="true"
          className="absolute inset-[9%] rounded-full border border-amber-100/45 bg-black/35 shadow-[0_0_42px_rgba(244,200,123,0.32)] transition-transform duration-500 group-hover:scale-105"
        />
        <Clapperboard
          aria-hidden="true"
          className="relative -mt-0.5 h-4 w-4 text-amber-100/80 sm:h-5 sm:w-5"
          strokeWidth={1.5}
        />
      </span>

      <span className="mt-1 font-tc text-[12px] tracking-[0.42em] text-amber-50 sm:text-[15px]">
        {replay ? '重播影片' : '放映開始'}
      </span>
      <span className="flex items-center gap-1.5 text-[7.5px] uppercase tracking-[0.4em] text-white/55 sm:text-[9px]">
        <Play size={8} fill="currentColor" />
        {replay ? 'Watch again' : 'Start movie'}
      </span>
    </motion.button>
  )
}

function Controls({
  playing,
  time,
  duration,
  progress,
  onToggle,
  onSkip,
  onSeek,
  onScrubStart,
  onScrubEnd,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.26, ease: EASE }}
      className="absolute inset-x-0 bottom-0 z-40 px-2 pb-1 pt-5 sm:px-3.5 sm:pb-2.5 sm:pt-9"
      style={{
        background:
          'linear-gradient(to top, rgba(4,3,6,0.94) 0%, rgba(4,3,6,0.66) 52%, rgba(4,3,6,0) 100%)',
      }}
    >
      <input
        type="range"
        min="0"
        max={duration > 0 ? duration : 1}
        step="0.05"
        value={Math.min(time, duration || 1)}
        onChange={(event) => onSeek(Number(event.target.value))}
        onPointerDown={onScrubStart}
        onPointerUp={onScrubEnd}
        onPointerCancel={onScrubEnd}
        onBlur={onScrubEnd}
        aria-label="Seek through the film"
        aria-valuetext={`${formatTime(time)} of ${formatTime(duration)}`}
        className="cinema-scrubber block w-full"
        style={{ '--progress': `${Math.round(progress * 1000) / 10}%` }}
      />

      <div className="mt-1 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <ControlButton label="Back 10 seconds" onClick={() => onSkip(-10)}>
            <RotateCcw size={12} strokeWidth={1.9} />
          </ControlButton>

          <ControlButton label={playing ? 'Pause' : 'Play'} onClick={onToggle} primary>
            {playing ? (
              <Pause size={12} fill="currentColor" strokeWidth={1.5} />
            ) : (
              <Play size={12} fill="currentColor" strokeWidth={1.5} className="ml-0.5" />
            )}
          </ControlButton>

          <ControlButton label="Forward 10 seconds" onClick={() => onSkip(10)}>
            <RotateCw size={12} strokeWidth={1.9} />
          </ControlButton>
        </div>

        <span className="shrink-0 font-display text-[9px] tabular-nums tracking-[0.14em] text-white/60 sm:text-[10px]">
          {formatTime(time)} <span className="text-white/30">/</span> {formatTime(duration)}
        </span>
      </div>
    </motion.div>
  )
}

export default function Cinema({ onBack }) {
  const videoRef = useRef(null)
  const [started, setStarted] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [controlsVisible, setControlsVisible] = useState(true)
  const [scrubbing, setScrubbing] = useState(false)
  const [failed, setFailed] = useState(false)
  const [activity, setActivity] = useState(0)

  const controlsRef = useRef(true)
  const revealAt = useRef(0)
  const lastWake = useRef(0)

  const progress = duration > 0 ? Math.min(1, time / duration) : 0

  useEffect(() => {
    controlsRef.current = controlsVisible
  }, [controlsVisible])

  // Always leave the theatre quietly: pause playback when the scene unmounts.
  useEffect(() => {
    const video = videoRef.current
    return () => {
      video?.pause()
    }
  }, [])

  // Reveal the controls on any pointer activity, then let them fade away while
  // the film keeps playing. Paused or scrubbing keeps them pinned open.
  useEffect(() => {
    if (!playing || scrubbing) {
      setControlsVisible(true)
      return undefined
    }
    if (!controlsVisible) return undefined

    const timer = window.setTimeout(() => setControlsVisible(false), 2800)
    return () => window.clearTimeout(timer)
  }, [playing, scrubbing, controlsVisible, activity])

  const wake = () => {
    if (!controlsRef.current) revealAt.current = performance.now()
    setControlsVisible(true)

    // Pointer movement can fire dozens of times a second. Only refresh the
    // auto-hide timer a few times a second to avoid needless re-renders.
    const now = performance.now()
    if (now - lastWake.current > 300) {
      lastWake.current = now
      setActivity((value) => value + 1)
    }
  }

  const play = async () => {
    const video = videoRef.current
    if (!video) return
    try {
      await video.play()
      setStarted(true)
    } catch {
      setFailed(true)
    }
  }

  const pause = () => videoRef.current?.pause()

  const toggle = () => (playing ? pause() : play())

  const skip = (delta) => {
    const video = videoRef.current
    if (!video) return
    const limit = duration || video.duration || 0
    const next = Math.min(Math.max(0, (video.currentTime || 0) + delta), limit)
    video.currentTime = next
    setTime(next)
    wake()
  }

  const seek = (value) => {
    const video = videoRef.current
    if (!video) return
    video.currentTime = value
    setTime(value)
    wake()
  }

  const start = () => {
    const video = videoRef.current
    if (!video) return
    setFailed(false)
    if (video.ended || (duration > 0 && video.currentTime >= duration - 0.25)) {
      video.currentTime = 0
      setTime(0)
    }
    play()
    wake()
  }

  const handleSurface = () => {
    if (!started || failed) return

    // A tap that just revealed the controls should not also pause the film.
    // Leave a short grace window after the reveal.
    if (!controlsRef.current || performance.now() - revealAt.current < 420) {
      wake()
      return
    }
    toggle()
  }

  const hasProgress = time > 0.4

  return (
    <div className="relative h-full w-full bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_30%,rgba(255,188,116,0.13),transparent_54%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080407]/65 via-transparent to-[#040306]" />

      <SceneCaption
        place="西門町 · 老戲院"
        title="戲院"
        subtitle="The Cinema"
        meta="19:00 · 一人包場"
        className="left-5 top-5 sm:left-10 sm:top-9"
      />

      {/* Projection stage. The region is a size container, so the 16:9 screen
          always fits between the caption and the audience on any viewport. */}
      <div className="cinema-stage-region pointer-events-none absolute inset-x-0 z-20 flex items-center justify-center px-3 sm:px-8">
        <motion.div
          className="cinema-stage pointer-events-auto relative aspect-video"
          initial={{ opacity: 0, y: 16, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1.25, delay: 0.3, ease: EASE }}
          onPointerMove={wake}
          onPointerDown={wake}
        >
          <div className="relative h-full w-full overflow-hidden rounded-[3px] border border-amber-100/20 bg-black shadow-[0_0_110px_rgba(255,184,112,0.2),0_26px_70px_rgba(0,0,0,0.8)]">
            <video
              ref={videoRef}
              src={FILM_SRC}
              preload="metadata"
              playsInline
              loop={false}
              aria-label="A short film about Taiwan, playing in the old cinema"
              className="absolute inset-0 h-full w-full bg-black object-cover"
              onClick={handleSurface}
              onLoadedMetadata={(event) => {
                const value = event.currentTarget.duration
                if (Number.isFinite(value)) setDuration(value)
              }}
              onDurationChange={(event) => {
                const value = event.currentTarget.duration
                if (Number.isFinite(value)) setDuration(value)
              }}
              onTimeUpdate={(event) => setTime(event.currentTarget.currentTime)}
              onPlay={() => {
                setPlaying(true)
                setStarted(true)
                wake()
              }}
              onPause={() => setPlaying(false)}
              onEnded={() => {
                setPlaying(false)
                setStarted(false)
                setControlsVisible(true)
              }}
              onError={() => {
                setFailed(true)
                setStarted(false)
                setPlaying(false)
              }}
            >
              Your browser cannot play this film.
            </video>

            {/* Darken the screen until the projector starts. */}
            {!started ? (
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,7,12,0.15),rgba(3,2,5,0.72))]" />
            ) : null}

            <div className="scanlines pointer-events-none absolute inset-0 opacity-[0.16]" />
            <div className="film-grain pointer-events-none absolute inset-0 opacity-25" />
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_70px_rgba(0,0,0,0.75)]" />

            <AnimatePresence>
              {!started ? <StartOverlay onStart={start} replay={hasProgress} /> : null}
            </AnimatePresence>

            <AnimatePresence>
              {started && controlsVisible && !failed ? (
                <Controls
                  playing={playing}
                  time={time}
                  duration={duration}
                  progress={progress}
                  onToggle={toggle}
                  onSkip={skip}
                  onSeek={seek}
                  onScrubStart={() => {
                    setScrubbing(true)
                    wake()
                  }}
                  onScrubEnd={() => {
                    setScrubbing(false)
                    wake()
                  }}
                />
              ) : null}
            </AnimatePresence>

            {failed ? (
              <div className="absolute inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-black/80 px-6 text-center">
                <Clapperboard className="h-6 w-6 text-amber-100/60" strokeWidth={1.4} />
                <p className="font-tc text-[12px] tracking-[0.26em] text-amber-50/90">
                  影片無法播放
                </p>
                <p className="max-w-[28rem] text-[9px] leading-relaxed tracking-[0.16em] text-white/50">
                  The theatre reel could not be loaded. Check that the movie file exists at{' '}
                  <span className="text-white/75">{FILM_SRC}</span>.
                </p>
              </div>
            ) : null}
          </div>
        </motion.div>
      </div>

      <Audience />

      <div className="pointer-events-none absolute inset-x-0 bottom-[9%] z-30 h-28 bg-[radial-gradient(ellipse_at_center,rgba(244,196,133,0.09),transparent_70%)]" />

      <div className="absolute bottom-[4%] left-[6%] z-40 origin-bottom-left scale-[0.85] sm:scale-100">
        <FloorArrow
          direction="back"
          title="返回街口"
          subtitle="Back"
          accent="#d9c7ab"
          labelPlacement="above"
          onClick={onBack}
        />
      </div>
    </div>
  )
}
