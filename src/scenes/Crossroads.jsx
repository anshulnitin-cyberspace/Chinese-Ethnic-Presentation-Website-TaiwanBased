import { motion } from 'framer-motion'
import FloorArrow from '../components/FloorArrow'
import { SceneCaption, SceneHint } from '../components/SceneCaption'

export default function Crossroads({ onCinema, onNightMarket, onMuseum }) {
  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_74%_18%,rgba(255,160,92,0.13),transparent_44%),radial-gradient(circle_at_16%_32%,rgba(56,132,148,0.12),transparent_46%)]" />

      <SceneCaption
        place="台北 · 西門町"
        title="十字路口"
        subtitle="The Crossroads"
        meta="18:42 · 華燈初上"
        className="left-5 top-5 sm:left-10 sm:top-9"
      />

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-7 hidden items-center gap-2 text-[9px] uppercase tracking-[0.32em] text-white/40 sm:flex"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 1.2 }}
      >
        <span className="h-1 w-1 rounded-full bg-amber-200/70 shadow-[0_0_8px_rgba(253,230,138,0.8)]" />
        微雨 · 24°C
      </motion.div>

      {/* floor falloff keeps the painted arrows legible */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[48%] bg-gradient-to-t from-[#050506] via-[#050506]/65 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[22%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(251,191,36,0.1),transparent_65%)]" />

      <div className="absolute bottom-[7%] left-[15%] z-30 sm:bottom-[10%] sm:left-[11%]">
        <FloorArrow
          direction="left"
          title="電影院"
          subtitle="Cinema"
          accent="#f0bd72"
          onClick={onCinema}
        />
      </div>

      <div className="absolute bottom-[11%] left-1/2 z-30 -translate-x-1/2 sm:bottom-[13%]">
        <FloorArrow
          direction="straight"
          title="地景館"
          subtitle="Landmark museum"
          accent="#9ecbb8"
          size="lg"
          onClick={onMuseum}
        />
      </div>

      <div className="absolute bottom-[7%] right-[15%] z-30 sm:bottom-[10%] sm:right-[11%]">
        <FloorArrow
          direction="right"
          title="夜市"
          subtitle="Night market"
          accent="#f39a9d"
          onClick={onNightMarket}
        />
      </div>

      <SceneHint className="bottom-3.5">點擊地面箭頭 · Follow the floor arrows</SceneHint>
    </div>
  )
}
