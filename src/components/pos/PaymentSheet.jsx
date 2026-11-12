import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  Landmark,
  MessageCircle,
  ShieldCheck,
  Smartphone,
  X,
} from 'lucide-react'
import { METHODS, money } from './posCopy'

const ICONS = {
  smartphone: Smartphone,
  message: MessageCircle,
  landmark: Landmark,
}

export default function PaymentSheet({
  open,
  lang,
  t,
  selected,
  onSelect,
  onConfirm,
  onClose,
  total,
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col justify-end"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
        >
          <button
            type="button"
            aria-label={t.close}
            className="absolute inset-0 cursor-default bg-[#04060a]/70 backdrop-blur-[3px]"
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t.payTitle}
            className="relative overflow-hidden rounded-t-[28px] border-t border-white/15 bg-[#0b0f14]/95 px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-[0_-30px_80px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
          >
            <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-20 top-10 h-48 w-48 rounded-full bg-amber-300/10 blur-3xl" />

            <div className="relative mx-auto mb-4 h-1 w-10 rounded-full bg-white/20" />

            <div className="relative flex items-start justify-between gap-3">
              <div>
                <h3 className="font-tc text-lg tracking-[0.12em] text-[#fff4df]">{t.payTitle}</h3>
                <p className="mt-1 text-[10px] tracking-wide text-white/40">{t.paySub}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-amber-200/15 bg-amber-200/8 px-2.5 py-1 font-display text-xs tabular-nums text-amber-100/90">
                  {money(total)}
                </span>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label={t.cancel}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
                >
                  <X size={13} strokeWidth={1.8} />
                </button>
              </div>
            </div>

            <div className="relative mt-4 space-y-2">
              {METHODS.map((method) => {
                const Icon = ICONS[method.icon]
                const active = selected === method.id
                return (
                  <motion.button
                    key={method.id}
                    type="button"
                    onClick={() => onSelect(method.id)}
                    whileTap={{ scale: 0.985 }}
                    className={`flex w-full items-center gap-3 rounded-2xl border p-3 text-left transition ${
                      active
                        ? 'border-white/25 bg-white/[0.08]'
                        : 'border-white/8 bg-white/[0.035] hover:border-white/15 hover:bg-white/[0.055]'
                    }`}
                    style={
                      active
                        ? { boxShadow: `inset 0 0 0 1px ${method.color}55, 0 10px 34px ${method.glow}` }
                        : undefined
                    }
                  >
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10"
                      style={{ background: `${method.color}1c`, color: method.color }}
                    >
                      <Icon size={18} strokeWidth={1.8} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[13px] font-medium text-white/90">
                        {lang === 'zh' ? method.zh : method.en}
                      </span>
                      <span className="block truncate text-[9px] text-white/35">
                        {lang === 'zh' ? method.subZh : method.subEn}
                      </span>
                    </span>
                    <span
                      className={`flex h-5 w-5 items-center justify-center rounded-full border transition ${
                        active ? 'border-transparent text-[#08110c]' : 'border-white/20 text-transparent'
                      }`}
                      style={active ? { background: method.color } : undefined}
                    >
                      <Check size={11} strokeWidth={3} />
                    </span>
                  </motion.button>
                )
              })}
            </div>

            <motion.button
              type="button"
              onClick={() => onConfirm(selected)}
              whileTap={{ scale: 0.985 }}
              className="relative mt-4 flex w-full items-center justify-between rounded-2xl bg-[#f2e2c2] px-5 py-3.5 text-[#1c1408] shadow-[0_16px_40px_rgba(244,222,180,0.16)] transition hover:bg-[#f8ebd3]"
            >
              <span className="flex flex-col items-start">
                <span className="text-[9px] uppercase tracking-[0.22em] text-[#1c1408]/50">
                  {t.scanToPay}
                </span>
                <span className="text-[13px] font-semibold tracking-wide">
                  {t.confirmPay} · {money(total)}
                </span>
              </span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1c1408] text-[#f6e8cc]">
                <ArrowRight size={15} strokeWidth={2} />
              </span>
            </motion.button>

            <p className="relative mt-3 flex items-center justify-center gap-1.5 text-[8px] uppercase tracking-[0.22em] text-white/25">
              <ShieldCheck size={10} strokeWidth={1.7} />
              {t.secure}
            </p>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
