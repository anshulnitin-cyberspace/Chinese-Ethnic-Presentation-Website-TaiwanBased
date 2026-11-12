import { AnimatePresence, motion } from 'framer-motion'
import { Check, ScanLine, ShieldCheck, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import QrMark from './QrMark'

export default function ScannerOverlay({ open, onClose, onSuccess }) {
  const [phase, setPhase] = useState('scanning')
  const successRef = useRef(onSuccess)

  useEffect(() => {
    successRef.current = onSuccess
  }, [onSuccess])

  useEffect(() => {
    if (!open) {
      setPhase('scanning')
      return undefined
    }

    setPhase('scanning')
    const scanTimer = window.setTimeout(() => setPhase('success'), 2450)
    const openTimer = window.setTimeout(() => successRef.current?.(), 3450)

    return () => {
      window.clearTimeout(scanTimer)
      window.clearTimeout(openTimer)
    }
  }, [open])

  useEffect(() => {
    if (!open) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[70] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div
            className="absolute inset-0 bg-[#050507]/80 backdrop-blur-md"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Scan the night market stall QR code"
            className="liquid-shell liquid-sheen relative w-full max-w-[364px] overflow-hidden rounded-[28px] p-6"
            initial={{ opacity: 0, y: 26, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={{ type: 'spring', stiffness: 260, damping: 26 }}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close scanner"
              autoFocus
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/55 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/70"
            >
              <X size={14} strokeWidth={1.8} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl border border-amber-200/20 bg-amber-200/10 text-amber-200">
                <ScanLine size={17} strokeWidth={1.7} />
              </div>
              <h2 className="mt-3 font-tc text-lg tracking-[0.18em] text-[#fff3dd]">
                掃描攤位 QR
              </h2>
              <p className="mt-1 font-display text-[12px] italic tracking-[0.14em] text-white/40">
                Scan stall QR
              </p>
              <p className="mt-3 text-[10px] leading-relaxed tracking-wide text-white/45">
                請將感應牌對準框內
                <span className="mx-1.5 text-white/20">·</span>
                Align the stall code within the frame
              </p>

              <div className="relative mt-5 w-full max-w-[248px]">
                <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#f8f2e4] p-3 shadow-[0_20px_60px_rgba(0,0,0,0.55),0_0_50px_rgba(52,211,153,0.08)]">
                  <QrMark className="w-full" />

                  <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-amber-500/80" />
                  <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-amber-500/80" />
                  <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-amber-500/80" />
                  <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-amber-500/80" />

                  {phase === 'scanning' ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute inset-x-3 top-4 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_12px_rgba(16,185,129,0.95)]"
                      animate={{ top: ['8%', '92%', '8%'] }}
                      transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  ) : null}

                  <AnimatePresence>
                    {phase === 'success' ? (
                      <motion.div
                        className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl bg-[#07110d]/90 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      >
                        <motion.div
                          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400 text-[#04110c] shadow-[0_0_40px_rgba(52,211,153,0.55)]"
                          initial={{ scale: 0.4, rotate: -18 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 360, damping: 18 }}
                        >
                          <Check size={28} strokeWidth={2.6} />
                        </motion.div>
                        <p className="mt-3 text-[10px] uppercase tracking-[0.32em] text-emerald-200/90">
                          Scan complete
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>

                <motion.div
                  aria-hidden="true"
                  className="absolute -inset-2 -z-10 rounded-[22px] bg-emerald-400/10 blur-xl"
                  animate={{ opacity: [0.25, 0.6, 0.25] }}
                  transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                />
              </div>

              <div className="mt-5 w-full">
                <div className="flex items-center justify-between text-[8px] uppercase tracking-[0.26em]">
                  <span className="flex items-center gap-1.5 text-white/45">
                    <motion.span
                      className={`h-1.5 w-1.5 rounded-full ${
                        phase === 'success' ? 'bg-emerald-400' : 'bg-amber-300'
                      }`}
                      animate={{ opacity: [0.35, 1, 0.35] }}
                      transition={{ duration: 1.4, repeat: Infinity }}
                    />
                    {phase === 'success' ? '已連結 · Connected' : '感應中 · Reading code'}
                  </span>
                  <span className="text-white/25">A-17</span>
                </div>

                <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/8">
                  <motion.div
                    className={`h-full rounded-full ${
                      phase === 'success'
                        ? 'bg-emerald-400'
                        : 'bg-gradient-to-r from-amber-300 via-amber-200 to-emerald-300'
                    }`}
                    initial={{ width: '0%' }}
                    animate={{ width: phase === 'success' ? '100%' : '88%' }}
                    transition={{ duration: phase === 'success' ? 0.35 : 2.35, ease: 'easeInOut' }}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-[8px] uppercase tracking-[0.24em] text-white/30">
                <ShieldCheck size={11} strokeWidth={1.6} />
                阿嬤の攤 · 夜市通 SecurePay
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
