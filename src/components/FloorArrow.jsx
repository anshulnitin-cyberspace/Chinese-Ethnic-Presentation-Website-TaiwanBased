import { motion } from 'framer-motion'
import { useId } from 'react'

const ANGLES = {
  straight: 0,
  left: -90,
  right: 90,
  back: 180,
}

/**
 * A navigation arrow mapped onto the floor plane.
 * The arrow itself lives in a rotateX / rotateZ 3D plane, while the caption
 * stays upright — the same visual language as Street View floor chevrons.
 */
export default function FloorArrow({
  direction = 'straight',
  title,
  subtitle,
  accent = '#f4c87b',
  className = '',
  onClick,
  labelPlacement = 'below',
  size = 'md',
}) {
  const rawId = useId()
  const uid = rawId.replace(/[^a-zA-Z0-9]/g, '')
  const angle = ANGLES[direction] ?? 0
  const above = labelPlacement === 'above'

  const width = size === 'lg' ? 'w-[88px] sm:w-[122px]' : 'w-[70px] sm:w-[100px]'

  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={`${title} — ${subtitle}`}
      className={`floor-arrow-button group relative z-30 cursor-pointer select-none rounded-[40px] p-2 outline-none focus-visible:ring-2 focus-visible:ring-white/70 ${className}`}
      whileHover="hover"
      whileTap="tap"
      initial="rest"
      animate="rest"
    >
      <motion.div
        className={`flex flex-col items-center ${above ? 'flex-col-reverse' : ''}`}
        variants={{ rest: {}, hover: {}, tap: {} }}
      >
        <div className="floor-stage">
          <div
            className="floor-plane"
            style={{ transform: `rotateX(57deg) rotateZ(${angle}deg)` }}
          >
            <motion.div
              className="relative"
              variants={{ rest: { z: 0 }, hover: { z: 26 }, tap: { z: 8 } }}
              transition={{ type: 'spring', stiffness: 210, damping: 16 }}
            >
              <motion.span
                aria-hidden="true"
                className="absolute -inset-12 rounded-full blur-2xl"
                style={{
                  background: `radial-gradient(circle, ${accent}66 0%, ${accent}22 42%, transparent 72%)`,
                }}
                animate={{ opacity: [0.45, 0.8, 0.45] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
              />

              <motion.svg
                viewBox="0 0 120 152"
                className={`relative h-auto ${width}`}
                animate={{ scale: [1, 1.035, 1] }}
                transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                aria-hidden="true"
              >
                <defs>
                  <linearGradient id={`fill-${uid}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={accent} stopOpacity="0.62" />
                    <stop offset="52%" stopColor={accent} stopOpacity="0.22" />
                    <stop offset="100%" stopColor="#07080a" stopOpacity="0.38" />
                  </linearGradient>
                  <linearGradient id={`edge-${uid}`} x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#fff7e3" stopOpacity="0.95" />
                    <stop offset="48%" stopColor={accent} stopOpacity="0.95" />
                    <stop offset="100%" stopColor={accent} stopOpacity="0.35" />
                  </linearGradient>
                </defs>

                <ellipse
                  cx="60"
                  cy="82"
                  rx="55"
                  ry="63"
                  fill="none"
                  stroke={accent}
                  strokeOpacity="0.32"
                  strokeWidth="1.4"
                  strokeDasharray="3 10"
                />
                <path
                  d="M60 5 L113 65 H84 V145 H36 V65 H7 Z"
                  fill={`url(#fill-${uid})`}
                  stroke={`url(#edge-${uid})`}
                  strokeWidth="2.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M60 26 L87 59 H73 V121 H47 V59 H33 Z"
                  fill="none"
                  stroke="#ffffff"
                  strokeOpacity="0.55"
                  strokeWidth="1.25"
                  strokeDasharray="4 7"
                  strokeLinejoin="round"
                />
                <path
                  d="M60 72 V112"
                  stroke={accent}
                  strokeOpacity="0.6"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeDasharray="2 8"
                />
                <ellipse
                  cx="60"
                  cy="6"
                  rx="23"
                  ry="5"
                  fill="#fff6e2"
                  fillOpacity="0.5"
                />
              </motion.svg>
            </motion.div>
          </div>
        </div>

        <div
          className={`floor-label flex flex-col items-center gap-1 ${
            above ? 'mb-2' : 'mt-0.5'
          }`}
        >
          <span className="flex items-center gap-2 rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[7.5px] uppercase tracking-[0.2em] text-white/80 shadow-[0_8px_24px_rgba(0,0,0,0.45)] backdrop-blur-md sm:text-[9px]">
            <span
              className="h-1 w-1 rounded-full"
              style={{ background: accent, boxShadow: `0 0 9px ${accent}` }}
            />
            {subtitle}
          </span>
          <span className="font-tc text-[10px] tracking-[0.28em] text-white/55 transition-colors group-hover:text-white/85 sm:text-[11px]">
            {title}
          </span>
        </div>
      </motion.div>
    </motion.button>
  )
}
