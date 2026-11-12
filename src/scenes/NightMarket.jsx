import { AnimatePresence, motion } from 'framer-motion'
import { CheckCircle2, ScanLine } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import FloorArrow from '../components/FloorArrow'
import { Motes } from '../components/Motes'
import QrMark from '../components/QrMark'
import ScannerOverlay from '../components/ScannerOverlay'
import PosOverlay from '../components/pos/PosOverlay'
import { SceneCaption, SceneHint } from '../components/SceneCaption'

function ScanSign({ onClick }) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label="Scan the glowing stall QR code to order"
      aria-haspopup="dialog"
      className="group absolute right-[4%] top-[25%] z-40 cursor-pointer rounded-[26px] p-2 outline-none focus-visible:ring-2 focus-visible:ring-amber-200/80 sm:right-[8%] sm:top-[27%]"
      initial={{ opacity: 0, y: 22, scale: 0.95 }}
      animate={{ opacity: 1, y: [0, -7, 0], scale: 1 }}
      transition={{
        opacity: { duration: 1, delay: 0.9 },
        scale: { duration: 1, delay: 0.9, ease: [0.22, 1, 0.36, 1] },
        y: { duration: 5.6, delay: 1.4, repeat: Infinity, ease: 'easeInOut' },
      }}
      whileHover={{ scale: 1.045, y: -4 }}
      whileTap={{ scale: 0.97 }}
    >
      <span
        aria-hidden="true"
        className="absolute -inset-6 rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.28),rgba(52,211,153,0.08)_48%,transparent_72%)] blur-2xl"
      />
      <motion.span
        aria-hidden="true"
        className="absolute inset-[-6px] rounded-[30px] border border-amber-200/35"
        animate={{ opacity: [0.18, 0.65, 0.18], scale: [1, 1.045, 1] }}
        transition={{ duration: 3.4, repeat: Infinity, ease: 'easeInOut' }}
      />

      <span
        aria-hidden="true"
        className="absolute -top-9 left-1/2 h-9 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-amber-200/25 to-amber-200/60"
      />
      <span
        aria-hidden="true"
        className="absolute -top-10 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full border border-amber-200/60 bg-[#0b0a09] shadow-[0_0_10px_rgba(253,230,138,0.55)]"
      />

      <div className="liquid-sheen relative w-[122px] rounded-[20px] border border-amber-100/25 bg-[#0c0b0a]/65 p-2.5 shadow-[0_18px_60px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-xl sm:w-[150px] sm:p-3">
        <div className="pointer-events-none absolute inset-0 rounded-[20px] bg-gradient-to-br from-amber-200/10 via-transparent to-emerald-300/6" />

        <div className="relative flex items-center justify-between">
          <span className="text-[6.5px] uppercase tracking-[0.22em] text-amber-100/60 sm:text-[7px]">
            A-17 · 阿嬤の攤
          </span>
          <span className="flex items-center gap-1 text-[6.5px] uppercase tracking-[0.18em] text-emerald-300/80 sm:text-[7px]">
            <motion.span
              className="h-1 w-1 rounded-full bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,0.9)]"
              animate={{ opacity: [0.45, 1, 0.45] }}
              transition={{ duration: 1.8, repeat: Infinity }}
            />
            Live
          </span>
        </div>

        <div className="relative mt-2 overflow-hidden rounded-xl bg-[#f8f2e4] p-1.5">
          <QrMark className="w-full" />
          <motion.span
            aria-hidden="true"
            className="absolute inset-x-1 h-[1.5px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.9)]"
            animate={{ top: ['12%', '86%', '12%'] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
          <span className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/10" />
        </div>

        <div className="relative mt-2 text-center">
          <p className="font-tc text-[13px] tracking-[0.18em] text-[#fff4dc] sm:text-[15px]">
            掃碼點餐
          </p>
          <p className="mt-0.5 text-[6.5px] uppercase tracking-[0.26em] text-amber-100/50 sm:text-[7px]">
            Scan to order
          </p>
        </div>

        <div className="relative mt-2 flex items-center justify-center gap-1.5 rounded-full border border-white/10 bg-white/5 py-1 text-[6.5px] uppercase tracking-[0.2em] text-white/60 sm:text-[7px]">
          <ScanLine size={8} strokeWidth={1.6} />
          輕觸感應 · Tap
        </div>
      </div>
    </motion.button>
  )
}

export default function NightMarket({ onBack }) {
  const [scannerOpen, setScannerOpen] = useState(false)
  const [posOpen, setPosOpen] = useState(false)
  const [receipt, setReceipt] = useState(null)
  const toastTimer = useRef(null)

  useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const handleScanComplete = () => {
    setScannerOpen(false)
    setPosOpen(true)
  }

  const handlePaymentComplete = (result) => {
    setPosOpen(false)
    setReceipt(result)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setReceipt(null), 5600)
  }

  return (
    <div className="relative h-full w-full">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_28%,rgba(251,191,36,0.15),transparent_44%),radial-gradient(circle_at_18%_62%,rgba(244,114,182,0.11),transparent_48%),linear-gradient(to_top,rgba(8,5,10,0.92),rgba(10,6,12,0.12)_46%,rgba(6,5,9,0.55))]" />
      <Motes count={14} tone="rose" bokeh className="opacity-60" />

      <SceneCaption
        place="台中 · 逢甲夜市"
        title="夜市"
        subtitle="The Night Market"
        meta="21:07 · 燈火正盛"
        className="left-5 top-5 sm:left-10 sm:top-9"
      />

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[1%] top-[17%] h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(253,230,138,0.18),transparent_66%)] blur-2xl"
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[34%] bg-gradient-to-t from-[#060408] via-[#060408]/62 to-transparent" />

      <ScanSign onClick={() => setScannerOpen(true)} />

      <div className="absolute bottom-[7%] left-[13%] z-30 sm:bottom-[9%] sm:left-[10%]">
        <FloorArrow
          direction="back"
          title="返回街口"
          subtitle="Back"
          accent="#c8d5cf"
          labelPlacement="above"
          onClick={onBack}
        />
      </div>

      <SceneHint className="bottom-3.5">
        輕觸發光的感應牌 · Tap the glowing stall sign
      </SceneHint>

      <div className="pointer-events-none absolute inset-x-0 top-5 z-[90] flex justify-center px-4">
        <AnimatePresence>
          {receipt ? (
            <motion.div
              key="paid-toast"
              initial={{ opacity: 0, y: -18, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -14, scale: 0.97 }}
              transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
              className="glass-panel flex items-center gap-3 rounded-full px-4 py-2.5"
              role="status"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400/15 text-emerald-300">
                <CheckCircle2 size={15} strokeWidth={1.8} />
              </span>
              <span className="flex flex-col">
                <span className="text-[11px] font-medium tracking-wide text-white/90">
                  {receipt.lang === 'zh' ? '付款成功' : 'Payment complete'} · NT${' '}
                  {receipt.total}
                </span>
                <span className="text-[8px] uppercase tracking-[0.24em] text-white/40">
                  {receipt.methodLabel} · {receipt.orderNo}
                </span>
              </span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>

      <ScannerOverlay
        open={scannerOpen}
        onClose={() => setScannerOpen(false)}
        onSuccess={handleScanComplete}
      />
      <PosOverlay
        open={posOpen}
        onClose={() => setPosOpen(false)}
        onComplete={handlePaymentComplete}
      />
    </div>
  )
}
