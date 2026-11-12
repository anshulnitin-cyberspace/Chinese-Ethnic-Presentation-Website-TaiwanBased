import { motion } from 'framer-motion'
import { Motes } from './Motes'

const sceneVariants = {
  enter: (mode) => ({
    opacity: 0,
    scale: mode === 'zoom' ? 1.24 : mode === 'emerge' ? 0.93 : 1.055,
    filter: 'blur(14px)',
  }),
  center: {
    opacity: 1,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 1.35, ease: [0.16, 1, 0.3, 1] },
  },
  exit: (mode) => ({
    opacity: 0,
    scale: mode === 'zoom' ? 1.42 : mode === 'emerge' ? 1.07 : 0.975,
    filter: 'blur(12px)',
    transition: { duration: 0.8, ease: [0.5, 0, 0.75, 0] },
  }),
}

/**
 * Full-viewport illustrated scene with a cinematic enter/exit transition.
 * `mode` controls the kind of camera move: walk | zoom | emerge
 */
export default function SceneFrame({
  src,
  srcSet,
  sizes = '100vw',
  alt,
  mode = 'walk',
  grade = '',
  imageClass = '',
  objectPosition = 'center',
  moteTone = 'amber',
  moteCount = 18,
  imageScale = 1.07,
  children,
}) {
  return (
    <motion.section
      className="absolute inset-0 overflow-hidden bg-[#07080a] will-change-transform"
      custom={mode}
      variants={sceneVariants}
      initial="enter"
      animate="center"
      exit="exit"
    >
      <motion.img
        src={src}
        srcSet={srcSet}
        sizes={srcSet ? sizes : undefined}
        alt={alt}
        draggable="false"
        className={`absolute inset-0 h-full w-full select-none object-cover ${imageClass}`}
        style={{ objectPosition }}
        initial={{ scale: imageScale }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.8, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className={`pointer-events-none absolute inset-0 ${grade}`} />
      <Motes tone={moteTone} count={moteCount} />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_38%,rgba(2,3,5,0.55)_100%)]" />

      <div className="relative z-10 h-full w-full">{children}</div>
    </motion.section>
  )
}
