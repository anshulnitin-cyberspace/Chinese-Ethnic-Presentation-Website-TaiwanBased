import { motion } from 'framer-motion'
import { useMemo } from 'react'

const TONES = {
  amber: ['#f6cf8a', '#e9a85d', '#ffe9bf'],
  ember: ['#f2a36b', '#d97757', '#ffd9a3'],
  jade: ['#9fe3c3', '#7cc9b0', '#e4fff1'],
  rose: ['#f3a6b8', '#d97f9d', '#ffe3ea'],
}

export function Motes({ count = 18, tone = 'amber', className = '', bokeh = false }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const left = (i * 37 + 11) % 100
        const top = 14 + ((i * 47 + 9) % 76)
        const size = (i % 4) * 0.9 + (bokeh ? 3 : 1.2)
        return {
          id: i,
          left,
          top,
          size,
          duration: 9 + (i % 7) * 2.1,
          delay: (i % 9) * 0.9,
          drift: i % 2 === 0 ? 22 : -18,
          color: TONES[tone][i % 3],
        }
      }),
    [count, tone, bokeh],
  )

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}
    >
      {motes.map((mote) => (
        <motion.span
          key={mote.id}
          className="absolute rounded-full"
          style={{
            left: `${mote.left}%`,
            top: `${mote.top}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            background: mote.color,
            boxShadow: `0 0 ${mote.size * 3.5}px ${mote.size}px ${mote.color}55`,
          }}
          animate={{
            y: [0, -26 - (mote.id % 4) * 10, -62],
            x: [0, mote.drift, mote.drift * 0.4],
            opacity: [0, 0.55, 0],
            scale: [0.7, 1, 0.55],
          }}
          transition={{
            duration: mote.duration,
            delay: mote.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}
