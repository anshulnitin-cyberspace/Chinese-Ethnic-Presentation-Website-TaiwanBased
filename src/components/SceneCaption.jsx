import { motion } from 'framer-motion'

export function SceneCaption({ place, title, subtitle, meta, className = '' }) {
  return (
    <motion.header
      className={`absolute z-30 ${className}`}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="flex items-center gap-3">
        <span className="h-px w-5 bg-white/40" />
        <span className="text-[9px] uppercase tracking-[0.42em] text-white/60 sm:text-[10px]">
          {place}
        </span>
      </div>
      <h1 className="mt-2 font-tc text-[clamp(22px,3.4vw,42px)] font-medium leading-none tracking-[0.2em] text-[#f9efdd] text-shadow-soft">
        {title}
      </h1>
      <p className="mt-2 font-display text-[13px] italic tracking-[0.16em] text-white/50 sm:text-sm">
        {subtitle}
      </p>
      {meta ? (
        <p className="mt-3 text-[9px] uppercase tracking-[0.28em] text-white/35 sm:text-[10px]">
          {meta}
        </p>
      ) : null}
    </motion.header>
  )
}

export function SceneHint({ children, className = '' }) {
  return (
    <motion.p
      className={`pointer-events-none absolute inset-x-0 z-20 text-center text-[8px] uppercase tracking-[0.4em] text-white/35 sm:text-[9px] ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.8, 0.45, 0.8] }}
      transition={{ duration: 6, times: [0, 0.25, 0.6, 1], delay: 2.4 }}
    >
      {children}
    </motion.p>
  )
}
