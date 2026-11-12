import { AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import SceneFrame from './components/SceneFrame'
import { landmarks } from './data/landmarks'
import Cinema from './scenes/Cinema'
import Crossroads from './scenes/Crossroads'
import Museum from './scenes/Museum'
import NightMarket from './scenes/NightMarket'

export default function App() {
  const [scene, setScene] = useState('crossroads')
  const [mode, setMode] = useState('walk')

  const navigate = (nextScene, transition) => {
    if (nextScene === scene) return
    setMode(transition)
    setScene(nextScene)
  }

  useEffect(() => {
    const sources = [
      '/scenes/crossroads-800.webp',
      '/scenes/cinema.jpg',
      '/scenes/museum-960.webp',
      '/scenes/nightmarket-1600.webp',
      ...landmarks.map((landmark) => landmark.image),
    ]
    sources.forEach((src) => {
      const image = new Image()
      image.src = src
    })
  }, [])

  return (
    <main className="relative h-[100dvh] w-full overflow-hidden bg-[#060709]">
      <AnimatePresence initial={false}>
        {scene === 'crossroads' ? (
          <SceneFrame
            key="crossroads"
            src="/scenes/crossroads-800.webp"
            srcSet="/scenes/crossroads-800.webp 800w, /scenes/crossroads.webp 1600w"
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
              onMuseum={() => navigate('museum', 'walk')}
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

        {scene === 'museum' ? (
          <SceneFrame
            key="museum"
            src="/scenes/museum-960.webp"
            srcSet="/scenes/museum-960.webp 960w, /scenes/museum.webp 1920w"
            alt="A glowing gallery hall of Taiwanese landmarks"
            mode={mode}
            objectPosition="center 48%"
            grade="bg-gradient-to-b from-[#050710]/70 via-transparent to-[#040508]/80"
            moteTone="amber"
            moteCount={22}
            imageScale={1.05}
          >
            <Museum onBack={() => navigate('crossroads', 'emerge')} />
          </SceneFrame>
        ) : null}

        {scene === 'nightmarket' ? (
          <SceneFrame
            key="nightmarket"
            src="/scenes/nightmarket-1600.webp"
            srcSet="/scenes/nightmarket-1600.webp 1600w, /scenes/nightmarket.webp 3200w"
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
    </main>
  )
}
