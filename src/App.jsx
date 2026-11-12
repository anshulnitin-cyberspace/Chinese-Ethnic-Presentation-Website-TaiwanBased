import { AnimatePresence, motion } from 'framer-motion'
import { Hourglass } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import SceneFrame from './components/SceneFrame'
import Cinema from './scenes/Cinema'
import Crossroads from './scenes/Crossroads'
import NightMarket from './scenes/NightMarket'

function AmbientToast({ message }) {
  return (
    <div className="pointer-events-none fixed inset-x-0 top-6 z-[60] flex justify-center px-4">
      <AnimatePresence>
        {message ? (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: -14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="glass-panel flex items-center gap-3 rounded-full px-4 py-2.5"
            role="status"
            aria-live="polite"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-amber-200/10 text-amber-200/80">
              <Hourglass size={13} strokeWidth={1.7} />
            </span>
            <span className="text-[10px] tracking-[0.08em] text-white/75">{message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  )
}

export default function App() {
  const [scene, setScene] = useState('crossroads')
  const [mode, setMode] = useState('walk')
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const showToast = (message) => {
    setToast(message)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 3400)
  }

  const navigate = (nextScene, transition) => {
    if (nextScene === scene) return
    setToast(null)
    setMode(transition)
    setScene(nextScene)
  }

  useEffect(() => {
    const sources = [
      '/scenes/crossroads.webp',
      '/scenes/cinema.jpg',
      '/scenes/nightmarket.webp',
    ]
    sources.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#060709]">
      <AnimatePresence initial={false}>
        {scene === 'crossroads' ? (
          <SceneFrame
            key="crossroads"
            src="/scenes/crossroads.webp"
            alt="An illustrated Taiwanese street intersection at dusk"
            mode={mode}
            objectPosition="center 55%"
            grade="bg-gradient-to-b from-[#090a10]/25 via-transparent to-[#050506]/60"
            moteTone="amber"
            moteCount={20}
          >
            <Crossroads
              onCinema={() => navigate('cinema', 'zoom')}
              onNightMarket={() => navigate('nightmarket', 'walk')}
              onComingSoon={() =>
                showToast('前方巷弄仍在準備中 · This alley is coming soon')
              }
            />
          </SceneFrame>
        ) : null}

        {scene === 'cinema' ? (
          <SceneFrame
            key="cinema"
            src="/scenes/cinema.jpg"
            alt="The warm glow of an old Taiwanese cinema"
            mode={mode}
            objectPosition="center 45%"
            grade="bg-gradient-to-b from-[#070409]/65 via-[#060308]/30 to-[#030204]/80"
            moteTone="ember"
            moteCount={14}
            imageScale={1}
          >
            <Cinema onBack={() => navigate('crossroads', 'emerge')} />
          </SceneFrame>
        ) : null}

        {scene === 'nightmarket' ? (
          <SceneFrame
            key="nightmarket"
            src="/scenes/nightmarket.webp"
            alt="Lanterns glowing above a lively Taiwanese night market"
            mode={mode}
            objectPosition="center 52%"
            grade="bg-gradient-to-t from-[#09050c]/70 via-[#120815]/20 to-[#07050c]/35"
            moteTone="rose"
            moteCount={16}
          >
            <NightMarket onBack={() => navigate('crossroads', 'emerge')} />
          </SceneFrame>
        ) : null}
      </AnimatePresence>

      <div className="grain-layer pointer-events-none fixed inset-0 z-[56] opacity-[0.055] mix-blend-overlay" />
      <div className="pointer-events-none fixed inset-0 z-[57] shadow-[inset_0_0_180px_rgba(0,0,0,0.5)]" />

      <AmbientToast message={toast} />
    </main>
  )
}
