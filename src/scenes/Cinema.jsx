import { motion } from 'framer-motion'
import FloorArrow from '../components/FloorArrow'
import { SceneCaption } from '../components/SceneCaption'
import useCoverFrame from '../lib/useCoverFrame'

// The bright screen painted into cinema.jpg, as fractions of the source image.
const SCREEN_BOUNDS = { x: 0.197, y: 0.111, w: 0.605, h: 0.506 }

const HEADS = Array.from({ length: 16 }, (_, i) => ({
  id: i,
  width: 5.2 + (i % 4) * 0.8,
  lift: (i % 5) * 4,
  opacity: 0.72 + (i % 4) * 0.07,
  blur: i % 4 === 0 ? 1.4 : 0,
}))

function Screen() {
  const frame = useCoverFrame(640 / 360, { x: 0.5, y: 0.45 })

  return (
    <motion.div
      className="pointer-events-none absolute z-20"
      style={{
        left: frame.left + frame.width * SCREEN_BOUNDS.x,
        top: frame.top + frame.height * SCREEN_BOUNDS.y,
        width: frame.width * SCREEN_BOUNDS.w,
        height: frame.height * SCREEN_BOUNDS.h,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.3, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="relative h-full w-full overflow-hidden rounded-[2px] border border-amber-100/20 bg-black shadow-[0_0_120px_rgba(255,184,112,0.22),0_30px_80px_rgba(0,0,0,0.8)]">
        <div className="film-screen absolute inset-0" />

        <motion.div
          aria-hidden="true"
          className="absolute -inset-10 opacity-50 blur-2xl"
          style={{
            background:
              'conic-gradient(from 40deg at 62% 42%, transparent 0deg, rgba(255,196,126,0.34) 26deg, transparent 68deg, rgba(164,76,112,0.28) 140deg, transparent 190deg)',
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
        />

        <motion.div
          aria-hidden="true"
          className="film-sun absolute right-[17%] top-[24%] aspect-square w-[13%] rounded-full bg-[#ffe3a9]"
          animate={{ opacity: [0.78, 0.95, 0.82], scale: [1, 1.035, 0.99] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
        />

        <svg
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[58%] w-full"
          viewBox="0 0 800 360"
          preserveAspectRatio="none"
        >
          <path
            d="M0 250 L96 190 L178 232 L268 146 L356 224 L440 168 L540 238 L642 176 L724 228 L800 196 L800 360 L0 360 Z"
            fill="#2d1b27"
            opacity="0.8"
          />
          <path
            d="M0 296 L110 244 L206 286 L300 222 L398 286 L496 240 L598 300 L700 244 L800 286 L800 360 L0 360 Z"
            fill="#160f18"
            opacity="0.95"
          />
        </svg>

        <motion.div
          aria-hidden="true"
          className="absolute inset-x-[-20%] top-[48%] h-[26%] bg-gradient-to-r from-transparent via-[#f4d7bb]/18 to-transparent blur-2xl"
          animate={{ x: ['-12%', '14%', '-12%'], opacity: [0.35, 0.7, 0.35] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}
        />

        <div className="absolute inset-x-0 bottom-[9%] px-6 text-center">
          <p className="font-display text-[7px] italic tracking-[0.55em] text-[#24161d]/60 sm:text-[9px]">
            A FORMOSA PICTURE
          </p>
          <h2 className="mt-1 font-tc text-[clamp(17px,3.2vw,40px)] tracking-[0.28em] text-[#fbecce] drop-shadow-[0_3px_18px_rgba(20,6,14,0.8)]">
            光陰的故事
          </h2>
          <p className="mt-1 text-[6px] uppercase tracking-[0.5em] text-white/50 sm:text-[8px]">
            Echoes of Formosa
          </p>
        </div>

        <div className="scanlines pointer-events-none absolute inset-0 opacity-35" />
        <div className="film-grain pointer-events-none absolute inset-0 opacity-50" />
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[#ffe7bf]"
          animate={{ opacity: [0, 0.015, 0.045, 0.008, 0.028, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'linear' }}
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.85)]" />
      </div>
    </motion.div>
  )
}

function Audience() {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[38%]">
      <div className="absolute inset-0 bg-gradient-to-t from-[#040306] via-[#040306]/82 to-transparent" />
      <div className="absolute inset-x-[-5%] bottom-[-5%] flex items-end justify-center gap-[1vw]">
        {HEADS.map((head) => (
          <div
            key={head.id}
            className="relative shrink-0"
            style={{
              width: `${head.width}%`,
              transform: `translateY(${head.lift}px)`,
              opacity: head.opacity,
              filter: head.blur ? `blur(${head.blur}px)` : undefined,
            }}
          >
            <div
              className="mx-auto aspect-square w-[62%] rounded-full bg-[#060509]"
              style={{
                boxShadow:
                  'inset 0 1px 0 rgba(255,206,150,0.18), 0 -3px 14px rgba(255,176,106,0.08)',
              }}
            />
            <div
              className="mx-auto -mt-[2%] h-[clamp(40px,7vh,84px)] rounded-t-[999px] bg-[#060509]"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,206,150,0.12)' }}
            />
          </div>
        ))}
      </div>
      <div className="absolute inset-x-0 bottom-0 h-1/4 bg-[#040306]" />
    </div>
  )
}

export default function Cinema({ onBack }) {
  return (
    <div className="relative h-full w-full bg-black">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_28%,rgba(255,188,116,0.13),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#080407]/70 via-transparent to-[#040306]" />

      <SceneCaption
        place="西門町 · 老戲院"
        title="戲院"
        subtitle="The Cinema"
        meta="19:00 · 一人包場"
        className="left-5 top-5 sm:left-10 sm:top-9"
      />

      <Screen />

      {/* Keeps the scene caption legible where it crosses the bright projection. */}
      <div className="pointer-events-none absolute left-0 top-0 z-[25] h-[52%] w-[72%] bg-[radial-gradient(ellipse_at_0%_0%,rgba(3,2,5,0.8)_0%,rgba(3,2,5,0.46)_34%,transparent_70%)]" />

      <Audience />

      <div className="pointer-events-none absolute inset-x-0 bottom-[8%] z-30 h-28 bg-[radial-gradient(ellipse_at_center,rgba(244,196,133,0.1),transparent_68%)]" />

      <div className="absolute bottom-[7%] left-1/2 z-40 -translate-x-1/2 scale-[0.85] sm:bottom-[8%] sm:scale-100">
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
