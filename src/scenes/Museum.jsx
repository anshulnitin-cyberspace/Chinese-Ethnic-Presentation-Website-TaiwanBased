import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CloudSun,
  Lamp,
  Landmark,
  MountainSnow,
  RotateCw,
  Waves,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import FloorArrow from '../components/FloorArrow'
import { SceneCaption, SceneHint } from '../components/SceneCaption'
import { landmarks } from '../data/landmarks'

const ICONS = {
  tower: Building2,
  lantern: Lamp,
  mountain: MountainSnow,
  lake: Waves,
  cloud: CloudSun,
  temple: Landmark,
}

const EASE = [0.22, 1, 0.36, 1]

const slideVariants = {
  enter: (direction) => ({
    opacity: 0,
    x: direction >= 0 ? 84 : -84,
    scale: 0.94,
    filter: 'blur(7px)',
  }),
  center: {
    opacity: 1,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.62, ease: EASE },
  },
  exit: (direction) => ({
    opacity: 0,
    x: direction >= 0 ? -84 : 84,
    scale: 0.94,
    filter: 'blur(7px)',
    transition: { duration: 0.4, ease: [0.5, 0, 0.75, 0] },
  }),
}

function ShuffleButton({ direction, accent, onClick }) {
  const Icon = direction < 0 ? ChevronLeft : ChevronRight

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={direction < 0 ? 'Previous landmark' : 'Next landmark'}
      className="group relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/60 shadow-[0_12px_34px_rgba(0,0,0,0.55),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-md outline-none transition-colors hover:border-white/45 hover:text-white focus-visible:ring-2 focus-visible:ring-white/70 sm:h-12 sm:w-12"
      whileHover={{ scale: 1.08, x: direction < 0 ? -2 : 2 }}
      whileTap={{ scale: 0.92 }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle, ${accent}2e 0%, transparent 70%)`,
        }}
      />
      <span
        aria-hidden="true"
        className="absolute inset-x-2 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
      />
      <Icon size={18} strokeWidth={1.6} />
    </motion.button>
  )
}

function CardFront({ landmark, index, total }) {
  return (
    <div data-card-front className="relative h-full w-full overflow-hidden bg-[#0a0c10]">
      {/* Horizontal crop at >= 768px, vertical crop below. Each orientation
          gets its own object-position so the subject stays centred. */}
      <picture
        className="block h-full w-full"
        style={{
          '--focal-mobile': landmark.focalMobile ?? 'center',
          '--focal-desktop': landmark.focalDesktop ?? landmark.focal ?? 'center',
        }}
      >
        <source media="(min-width: 768px)" srcSet={landmark.desktopImage} />
        <img
          src={landmark.mobileImage}
          alt={`${landmark.nameZh} — ${landmark.name}`}
          draggable="false"
          decoding="async"
          className="landmark-photo h-full w-full select-none object-cover"
        />
      </picture>

      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_38%,transparent_38%,rgba(4,5,8,0.45)_100%)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#07080b] via-[#07080b]/60 to-transparent" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />

      <span className="absolute right-3 top-3 rounded-full border border-white/15 bg-black/35 px-2 py-1 text-[7px] uppercase tracking-[0.22em] text-white/55 backdrop-blur-md sm:right-4 sm:top-4">
        {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </span>

      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4 sm:p-5">
        <div className="min-w-0">
          <p className="text-[7px] uppercase tracking-[0.34em] text-white/45 sm:text-[8px]">
            Landmark collection
          </p>
          <p className="mt-1.5 truncate font-tc text-[clamp(17px,2vw,26px)] tracking-[0.14em] text-[#fff2d8]">
            {landmark.nameZh}
          </p>
          <p className="mt-0.5 truncate text-[8px] uppercase tracking-[0.24em] text-white/55 sm:text-[9px]">
            {landmark.name}
          </p>
        </div>

        <span className="mb-0.5 flex shrink-0 items-center gap-1.5 rounded-full border border-white/20 bg-black/40 px-2.5 py-1.5 text-[7px] uppercase tracking-[0.18em] text-white/70 backdrop-blur-md sm:text-[8px]">
          <RotateCw size={9} strokeWidth={1.7} />
          Flip
        </span>
      </div>
    </div>
  )
}

function CardBack({ landmark, index }) {
  const Icon = ICONS[landmark.icon] ?? Landmark
  const seal = landmark.nameZh.replace(/\s/g, '').slice(0, 1)

  return (
    <div data-card-back className="relative h-full w-full overflow-hidden bg-[#efe2c6] text-[#241b12]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_10%,rgba(255,252,240,0.8),transparent_46%),radial-gradient(circle_at_88%_92%,rgba(154,111,58,0.18),transparent_52%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-[0.16] mix-blend-multiply [background-image:repeating-linear-gradient(112deg,rgba(90,64,32,0.35)_0px,rgba(90,64,32,0.35)_1px,transparent_1px,transparent_5px)]" />
      <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-[#7e5f34]/30" />

      <div data-card-back-inner className="landmark-back-fit relative flex h-full flex-col px-5 py-4 sm:px-7 sm:py-6">
        <div className="flex items-center justify-between gap-2 text-[6.5px] uppercase tracking-[0.24em] text-[#7c6138] sm:text-[8px]">
          <span className="flex items-center gap-1.5">
            <span className="h-1 w-1 rounded-full bg-[#a44a34]" />
            島嶼記憶 · Island memories
          </span>
          <span>No. {String(index + 1).padStart(2, '0')}</span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3 sm:mt-4">
          <div className="min-w-0">
            <h2 className="truncate font-tc text-[clamp(23px,2.6vw,36px)] leading-none tracking-[0.1em] text-[#241a10]">
              {landmark.nameZh}
            </h2>
            <p className="mt-1.5 truncate font-display text-[clamp(12px,1.3vw,17px)] italic tracking-[0.04em] text-[#5c472c]">
              {landmark.name}
            </p>
          </div>

          <span
            aria-hidden="true"
            className="flex h-9 w-9 shrink-0 -rotate-3 items-center justify-center rounded-[3px] border border-[#e5c79a]/60 bg-[#9c3b2e] font-tc text-[17px] text-[#fbe9c8] shadow-[0_4px_14px_rgba(82,34,24,0.35)] sm:h-11 sm:w-11 sm:text-[20px]"
          >
            {seal}
          </span>
        </div>

        <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[7px] uppercase tracking-[0.2em] text-[#84683d] sm:mt-3 sm:text-[9px]">
          <Icon size={11} strokeWidth={1.6} />
          <span>{landmark.location}</span>
          <span className="h-px w-3 bg-[#b0915b] sm:w-4" />
          <span>{landmark.era}</span>
        </div>

        <div className="my-2.5 h-px bg-gradient-to-r from-[#a98a54]/70 via-[#a98a54]/25 to-transparent sm:my-3.5" />

        <p className="text-[clamp(10px,1vw,13px)] leading-[1.5] text-[#3a2c1c]">
          {landmark.description}
        </p>
        <p className="mt-2 font-tc-sans text-[clamp(9.5px,0.9vw,12px)] leading-[1.6] text-[#6d5635]">
          {landmark.descriptionZh}
        </p>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="flex items-center gap-1.5 text-[6.5px] uppercase tracking-[0.22em] text-[#8b7044] sm:text-[8px]">
            <RotateCw size={9} strokeWidth={1.7} />
            點擊翻回 · Tap to flip back
          </span>
          <span
            aria-hidden="true"
            className="h-1.5 w-1.5 shrink-0 rounded-full"
            style={{ background: landmark.accent, boxShadow: `0 0 10px ${landmark.accent}` }}
          />
        </div>
      </div>
    </div>
  )
}

function LandmarkCard({ landmark, index, total, flipped, onFlip, reduceMotion }) {
  return (
    <motion.button
      data-landmark-card
      type="button"
      onClick={onFlip}
      aria-pressed={flipped}
      aria-label={
        flipped
          ? `Show the picture of ${landmark.name}`
          : `Read about ${landmark.name}`
      }
      className="group relative block h-full w-full cursor-pointer rounded-[7px] p-[6px] outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-black/50 sm:p-[9px]"
      style={{
        background:
          'linear-gradient(145deg, #e5c78f 0%, #a67c45 24%, #5d4225 52%, #c7a166 78%, #7a5a31 100%)',
        boxShadow:
          '0 42px 100px rgba(0,0,0,0.68), 0 0 70px rgba(226,188,124,0.1), inset 0 1px 0 rgba(255,240,208,0.5)',
      }}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.992 }}
      transition={{ type: 'spring', stiffness: 240, damping: 24 }}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -inset-6 -z-10 rounded-[22px] opacity-60 blur-2xl transition-opacity duration-500 group-hover:opacity-90"
        style={{
          background: `radial-gradient(ellipse at center, ${landmark.accent}26 0%, transparent 68%)`,
        }}
      />

      <div className="relative h-full w-full overflow-hidden rounded-[3px] border border-[#2a1e10]/60 bg-[#07090c] shadow-[inset_0_0_40px_rgba(0,0,0,0.55)]">
        <div className="h-full w-full" style={{ perspective: '1600px' }}>
          <motion.div
            className="relative h-full w-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.88,
              ease: [0.2, 0.85, 0.3, 1],
            }}
          >
            <div
              className="absolute inset-0"
              style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
            >
              <CardFront landmark={landmark} index={index} total={total} />
            </div>
            <div
              className="absolute inset-0"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
            >
              <CardBack landmark={landmark} index={index} />
            </div>
          </motion.div>
        </div>
      </div>

      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-[13px] top-[13px] h-3.5 w-3.5 border-l border-t border-[#ffe9c3]/60 sm:left-[17px] sm:top-[17px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-[13px] top-[13px] h-3.5 w-3.5 border-r border-t border-[#ffe9c3]/60 sm:right-[17px] sm:top-[17px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[13px] left-[13px] h-3.5 w-3.5 border-b border-l border-[#ffe9c3]/60 sm:bottom-[17px] sm:left-[17px]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-[13px] right-[13px] h-3.5 w-3.5 border-b border-r border-[#ffe9c3]/60 sm:bottom-[17px] sm:right-[17px]"
      />
      <span className="pointer-events-none absolute inset-0 rounded-[7px] ring-1 ring-inset ring-black/50" />
    </motion.button>
  )
}

export default function Museum({ onBack }) {
  const reduceMotion = useReducedMotion()
  const [{ index, direction }, setPage] = useState({ index: 0, direction: 0 })
  const [flipped, setFlipped] = useState(false)

  const total = landmarks.length
  const active = landmarks[index]
  const accent = active?.accent ?? '#e8bd7c'

  const go = useCallback(
    (step) => {
      setFlipped(false)
      setPage((page) => ({
        index: (page.index + step + total) % total,
        direction: step,
      }))
    },
    [total],
  )

  if (!active) return null

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(232,189,124,0.13),transparent_52%),linear-gradient(to_top,rgba(4,5,8,0.8),transparent_40%)]" />

      <SceneCaption
        place="台北 · 島嶼記憶館"
        title="地景館"
        subtitle="The Landmark Museum"
        meta={`常設展 · ${total} 件典藏`}
        className="left-5 top-5 sm:left-10 sm:top-9"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-[46%] h-[62vh] w-[62vh] max-w-[92vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(232,189,124,0.16),transparent_66%)] blur-2xl"
        animate={{ opacity: [0.45, 0.7, 0.45], scale: [1, 1.03, 1] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[30%] bg-gradient-to-t from-[#05060a] via-[#05060a]/60 to-transparent" />

      <div className="landmark-stage-region pointer-events-none absolute inset-x-0 top-0 bottom-[20%] z-30 flex items-center justify-center px-2 pb-2">
        <div className="pointer-events-auto flex w-fit items-center gap-1 sm:gap-4">
          <ShuffleButton direction={-1} accent={accent} onClick={() => go(-1)} />

          <div data-landmark-stage className="landmark-stage relative">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={active.id}
                custom={direction}
                variants={reduceMotion ? undefined : slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="absolute inset-0"
              >
                <LandmarkCard
                  landmark={active}
                  index={index}
                  total={total}
                  flipped={flipped}
                  onFlip={() => setFlipped((value) => !value)}
                  reduceMotion={reduceMotion}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <ShuffleButton direction={1} accent={accent} onClick={() => go(1)} />
        </div>
      </div>

      <div className="landmark-back-arrow">
        <FloorArrow
          direction="back"
          title="返回街口"
          subtitle="Back"
          accent="#d9c7ab"
          labelPlacement="above"
          onClick={onBack}
        />
      </div>

      <SceneHint className="bottom-3.5">
        左右箭頭換一件典藏 · Shuffle the collection
      </SceneHint>
    </div>
  )
}
