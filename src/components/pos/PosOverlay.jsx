import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight,
  Check,
  ChevronLeft,
  CreditCard,
  Delete,
  Landmark,
  Loader2,
  LockKeyhole,
  MessageCircle,
  Minus,
  Plus,
  ReceiptText,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { CATEGORIES, MENU } from '../../data/menu'
import PaymentSheet from './PaymentSheet'
import { METHODS, POS_COPY, methodLabel, money } from './posCopy'

const METHOD_ICONS = {
  smartphone: Smartphone,
  message: MessageCircle,
  landmark: Landmark,
}

const newOrderNo = () => {
  const now = new Date()
  const stamp = `${String(now.getMonth() + 1).padStart(2, '0')}${String(
    now.getDate(),
  ).padStart(2, '0')}`
  return `NB-${stamp}-${Math.floor(100 + Math.random() * 900)}`
}

/* -------------------------------------------------------------------------- */
/*                                   Skeleton                                 */
/* -------------------------------------------------------------------------- */

function Slab({ className = '', style }) {
  return <div className={`skeleton-shimmer rounded-md ${className}`} style={style} />
}

function MenuSkeleton({ t }) {
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="min-h-0 flex-1 overflow-hidden px-4 pt-4 sm:px-5">
        <Slab className="h-[112px] rounded-2xl" />

        <div className="mt-4 flex gap-2">
          {[44, 50, 46, 52].map((width, index) => (
            <Slab key={index} className="h-7 rounded-full" style={{ width }} />
          ))}
        </div>

        <div className="mt-5 flex items-end justify-between">
          <div>
            <Slab className="h-4 w-28" />
            <Slab className="mt-2 h-2 w-36" />
          </div>
          <motion.span
            className="text-[8px] uppercase tracking-[0.2em] text-white/30"
            animate={{ opacity: [0.35, 0.8, 0.35] }}
            transition={{ duration: 1.8, repeat: Infinity }}
          >
            {t.preparing}
          </motion.span>
        </div>

        <div className="mt-4 space-y-2.5">
          {[0, 1, 2, 3].map((index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-2xl border border-white/6 bg-white/[0.025] p-2.5"
            >
              <Slab className="h-[68px] w-[68px] shrink-0 rounded-xl" />
              <div className="flex-1">
                <Slab className="h-3 w-24" />
                <Slab className="mt-2 h-2 w-32" />
                <Slab className="mt-3 h-3 w-14" />
              </div>
              <Slab className="h-8 w-14 rounded-full" />
            </div>
          ))}
        </div>

        <p className="mt-4 text-center text-[9px] tracking-wide text-white/22">
          {t.preparingSub}
        </p>
      </div>

      <div className="shrink-0 border-t border-white/10 bg-[#0a0d10]/80 px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3">
          <Slab className="h-10 w-10 rounded-xl" />
          <div className="flex-1">
            <Slab className="h-2 w-12" />
            <Slab className="mt-2 h-5 w-24" />
          </div>
          <Slab className="h-10 w-32 rounded-full" />
        </div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  Menu step                                 */
/* -------------------------------------------------------------------------- */

function QuantityControl({ t, quantity, onAdd, onRemove }) {
  return (
    <div className="flex shrink-0 items-center gap-0.5 rounded-full border border-white/10 bg-white/[0.055] p-0.5">
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={onRemove}
        aria-label={`${t.add} −`}
        className="flex h-6 w-6 items-center justify-center rounded-full text-white/55 transition hover:bg-white/10 hover:text-white"
      >
        <Minus size={11} strokeWidth={2} />
      </motion.button>
      <span className="w-4 text-center text-[10px] font-medium tabular-nums text-white/90">
        {quantity}
      </span>
      <motion.button
        type="button"
        whileTap={{ scale: 0.88 }}
        onClick={onAdd}
        aria-label={t.add}
        className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-200/15 text-amber-100 transition hover:bg-amber-200/25"
      >
        <Plus size={11} strokeWidth={2} />
      </motion.button>
    </div>
  )
}

function MenuCard({ item, lang, t, quantity, onAdd, onRemove, index }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.36, delay: Math.min(index * 0.035, 0.2) }}
      className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-2.5 transition-colors hover:border-white/14 hover:bg-white/[0.05]"
    >
      <div
        className={`relative h-[68px] w-[68px] shrink-0 overflow-hidden rounded-xl border border-white/10 bg-gradient-to-br ${item.accent}`}
      >
        <span className="absolute inset-0 flex items-center justify-center text-2xl opacity-90">
          {item.emoji}
        </span>
        <img
          src={item.image}
          alt=""
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover"
          onError={(event) => {
            event.currentTarget.style.display = 'none'
          }}
        />
        <span className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/10" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-1.5">
          <h3 className="truncate text-[12.5px] font-medium tracking-wide text-white/90">
            {lang === 'zh' ? item.zh : item.en}
          </h3>
          {item.popular ? (
            <span className="shrink-0 rounded-full border border-amber-200/20 bg-amber-200/10 px-1.5 py-0.5 text-[6.5px] uppercase tracking-[0.14em] text-amber-200/75">
              {t.popular}
            </span>
          ) : null}
        </div>
        <p className="mt-0.5 line-clamp-1 text-[8.5px] tracking-wide text-white/35">
          {lang === 'zh' ? item.descZh : item.descEn}
        </p>
        <p className="mt-1 font-display text-[13px] tabular-nums text-[#f3d8a5]">
          {money(item.price)}
        </p>
      </div>

      {quantity > 0 ? (
        <QuantityControl
          t={t}
          quantity={quantity}
          onAdd={onAdd}
          onRemove={onRemove}
        />
      ) : (
        <motion.button
          type="button"
          whileTap={{ scale: 0.93 }}
          onClick={onAdd}
          className="flex h-7 shrink-0 items-center gap-1 rounded-full border border-amber-200/25 bg-amber-200/10 px-2.5 text-[9px] font-medium tracking-wide text-amber-100 transition hover:bg-amber-200/18"
        >
          <Plus size={10} strokeWidth={2.4} />
          {t.add}
        </motion.button>
      )}
    </motion.article>
  )
}

function CartBar({ t, count, total, onCheckout }) {
  return (
    <div className="relative shrink-0 border-t border-white/10 bg-[#0a0d10]/85 px-4 pb-[max(0.9rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl sm:px-5">
      <div className="flex items-center gap-3">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-amber-200/80">
          <ShoppingBag size={16} strokeWidth={1.7} />
          <AnimatePresence>
            {count > 0 ? (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#f2d9a4] px-1 text-[8px] font-bold text-[#1c1408]"
              >
                {count}
              </motion.span>
            ) : null}
          </AnimatePresence>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[8px] uppercase tracking-[0.24em] text-white/35">{t.total}</p>
          <div className="flex items-baseline gap-2">
            <p className="font-display text-lg leading-tight tabular-nums text-[#fff2d8]">
              {money(total)}
            </p>
            {count > 0 ? (
              <span className="text-[8px] tracking-wide text-white/30">
                {count} {t.itemsUnit}
              </span>
            ) : (
              <span className="text-[8px] tracking-wide text-white/25">{t.empty}</span>
            )}
          </div>
        </div>

        <motion.button
          type="button"
          whileTap={count > 0 ? { scale: 0.97 } : undefined}
          disabled={count === 0}
          onClick={onCheckout}
          className={`flex h-10 shrink-0 items-center gap-1.5 rounded-full px-4 text-[10px] font-semibold tracking-wide transition ${
            count > 0
              ? 'bg-[#f2e2c2] text-[#1c1408] shadow-[0_10px_28px_rgba(244,222,180,0.18)] hover:bg-[#f8ebd3]'
              : 'cursor-not-allowed border border-white/8 bg-white/[0.035] text-white/25'
          }`}
        >
          {t.checkout}
          <ArrowRight size={12} strokeWidth={2.2} />
        </motion.button>
      </div>
    </div>
  )
}

function MenuStep({
  t,
  lang,
  cart,
  addItem,
  removeItem,
  category,
  setCategory,
  visibleItems,
  count,
  total,
  onCheckout,
}) {
  return (
    <>
      <div className="pos-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-3 pt-4 sm:px-5">
        <div className="relative overflow-hidden rounded-2xl border border-white/10">
          <img
            src="/scenes/nightmarket-1600.webp"
            alt=""
            className="absolute inset-0 h-full w-full scale-105 object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#090c10]/95 via-[#090c10]/72 to-[#090c10]/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#090c10]/75 to-transparent" />

          <div className="relative p-4">
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[7px] uppercase tracking-[0.3em] text-amber-200/55">
                  A-17 · 逢甲夜市
                </p>
                <h2 className="mt-1 font-tc text-lg tracking-[0.16em] text-[#fff2d9]">
                  {t.stall}
                </h2>
                <p className="mt-0.5 text-[8.5px] tracking-wide text-white/35">{t.since}</p>
              </div>
              <span className="flex shrink-0 items-center gap-1 rounded-full border border-emerald-300/20 bg-emerald-300/8 px-2 py-1 text-[7px] uppercase tracking-[0.16em] text-emerald-200/80">
                <motion.span
                  className="h-1 w-1 rounded-full bg-emerald-300"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.8, repeat: Infinity }}
                />
                {t.open}
              </span>
            </div>

            <div className="mt-3 flex items-center gap-3 text-[8px] text-white/40">
              <span className="flex items-center gap-1 text-amber-200/80">
                <Star size={9} strokeWidth={1.8} fill="currentColor" />
                4.9
              </span>
              <span className="h-2.5 w-px bg-white/12" />
              <span>1,284</span>
              <span className="h-2.5 w-px bg-white/12" />
              <span>{lang === 'zh' ? '老字號' : 'Local favourite'}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="font-tc text-lg tracking-[0.14em] text-[#fff3dd]">{t.menuTitle}</h2>
            <p className="mt-0.5 text-[9px] tracking-wide text-white/35">{t.menuSub}</p>
          </div>
          <span className="flex items-center gap-1 text-[7px] uppercase tracking-[0.2em] text-amber-200/45">
            <Sparkles size={9} strokeWidth={1.6} />
            {t.popular}
          </span>
        </div>

        <div className="no-scrollbar -mx-1 mt-3 flex gap-2 overflow-x-auto px-1 pb-1">
          {CATEGORIES.map((entry) => {
            const active = category === entry.id
            return (
              <button
                key={entry.id}
                type="button"
                onClick={() => setCategory(entry.id)}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-[9.5px] tracking-wide transition ${
                  active
                    ? 'border-amber-200/35 bg-amber-200/14 text-amber-100'
                    : 'border-white/8 bg-white/[0.035] text-white/40 hover:border-white/15 hover:text-white/65'
                }`}
              >
                {lang === 'zh' ? entry.zh : entry.en}
              </button>
            )
          })}
        </div>

        <div className="mt-3 space-y-2.5">
          {visibleItems.map((item, index) => (
            <MenuCard
              key={item.id}
              item={item}
              lang={lang}
              t={t}
              quantity={cart[item.id] ?? 0}
              onAdd={() => addItem(item.id)}
              onRemove={() => removeItem(item.id)}
              index={index}
            />
          ))}
        </div>
      </div>

      <CartBar t={t} count={count} total={total} onCheckout={onCheckout} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Review step                                */
/* -------------------------------------------------------------------------- */

function StepHeader({ t, onBack, title, subtitle }) {
  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        onClick={onBack}
        aria-label={t.back}
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        <ChevronLeft size={14} strokeWidth={2} />
      </button>
      <div>
        <h2 className="font-tc text-lg tracking-[0.12em] text-[#fff3dd]">{title}</h2>
        <p className="mt-0.5 text-[9px] leading-relaxed tracking-wide text-white/35">
          {subtitle}
        </p>
      </div>
    </div>
  )
}

function ReviewStep({
  t,
  lang,
  cartItems,
  count,
  subtotal,
  total,
  orderType,
  setOrderType,
  onBack,
  onChoosePayment,
  method,
}) {
  const methodInfo = METHODS.find((entry) => entry.id === method) ?? METHODS[0]
  const MethodIcon = METHOD_ICONS[methodInfo.icon]

  return (
    <div className="pos-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-4 sm:px-5">
      <StepHeader t={t} onBack={onBack} title={t.reviewTitle} subtitle={t.reviewSub} />

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035]">
        <div className="flex items-center justify-between border-b border-white/8 px-4 py-3 text-[8px] uppercase tracking-[0.2em] text-white/40">
          <span className="flex items-center gap-1.5">
            <ReceiptText size={11} strokeWidth={1.7} />
            {t.orderItems}
          </span>
          <span>
            {count} {t.itemsUnit}
          </span>
        </div>

        <div className="space-y-3 p-4">
          {cartItems.map(({ item, quantity }) => (
            <div key={item.id} className="flex items-start justify-between gap-3">
              <div className="flex min-w-0 items-start gap-2">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[12px]">
                  {item.emoji}
                </span>
                <div className="min-w-0">
                  <p className="truncate text-[11px] text-white/85">
                    {lang === 'zh' ? item.zh : item.en}
                  </p>
                  <p className="mt-0.5 text-[8px] text-white/30">
                    {money(item.price)} × {quantity}
                  </p>
                </div>
              </div>
              <p className="shrink-0 font-display text-[12px] tabular-nums text-white/75">
                {money(item.price * quantity)}
              </p>
            </div>
          ))}
        </div>

        <div className="space-y-2 border-t border-dashed border-white/10 px-4 py-3 text-[10px]">
          <div className="flex justify-between text-white/40">
            <span>{t.subtotal}</span>
            <span className="tabular-nums">{money(subtotal)}</span>
          </div>
          <div className="flex justify-between text-white/40">
            <span>{t.serviceFee}</span>
            <span className="text-emerald-300/70">{t.free}</span>
          </div>
          <div className="flex items-baseline justify-between border-t border-white/8 pt-2 text-white/90">
            <span className="text-[9px] uppercase tracking-[0.2em]">{t.total}</span>
            <span className="font-display text-xl tabular-nums text-[#f7dfad]">
              {money(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <p className="text-[8px] uppercase tracking-[0.22em] text-white/35">{t.orderType}</p>
        <div className="mt-2 grid grid-cols-2 gap-1 rounded-2xl border border-white/8 bg-white/[0.03] p-1">
          <button
            type="button"
            onClick={() => setOrderType('dine')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] transition ${
              orderType === 'dine'
                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            <UtensilsCrossed size={12} strokeWidth={1.7} />
            {t.dineIn}
          </button>
          <button
            type="button"
            onClick={() => setOrderType('takeaway')}
            className={`flex items-center justify-center gap-1.5 rounded-xl py-2 text-[10px] transition ${
              orderType === 'takeaway'
                ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]'
                : 'text-white/35 hover:text-white/60'
            }`}
          >
            <ShoppingBag size={12} strokeWidth={1.7} />
            {t.takeaway}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-2xl border border-white/8 bg-white/[0.025] px-3 py-2.5">
        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10"
          style={{ background: `${methodInfo.color}1c`, color: methodInfo.color }}
        >
          <MethodIcon size={15} strokeWidth={1.8} />
        </span>
        <div className="flex-1">
          <p className="text-[7px] uppercase tracking-[0.2em] text-white/30">{t.method}</p>
          <p className="text-[10px] text-white/75">{methodLabel(method, lang)}</p>
        </div>
        <CreditCard size={14} strokeWidth={1.6} className="text-white/25" />
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.985 }}
        onClick={onChoosePayment}
        className="mt-4 flex w-full items-center justify-between rounded-2xl bg-[#f2e2c2] px-4 py-3.5 text-[#1c1408] shadow-[0_16px_40px_rgba(244,222,180,0.14)] transition hover:bg-[#f8ebd3]"
      >
        <span className="text-[12px] font-semibold tracking-wide">{t.choosePayment}</span>
        <span className="flex items-center gap-2 text-[11px] font-medium tabular-nums">
          {money(total)}
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1c1408] text-[#f6e8cc]">
            <ArrowRight size={13} strokeWidth={2.2} />
          </span>
        </span>
      </motion.button>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[7.5px] uppercase tracking-[0.2em] text-white/25">
        <ShieldCheck size={10} strokeWidth={1.7} />
        {t.secure}
      </p>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                   PIN step                                 */
/* -------------------------------------------------------------------------- */

function PinStep({
  t,
  lang,
  total,
  method,
  pin,
  pinError,
  errorKey,
  processing,
  onDigit,
  onBackspace,
  onClear,
  onBack,
}) {
  const methodInfo = METHODS.find((entry) => entry.id === method) ?? METHODS[0]
  const MethodIcon = METHOD_ICONS[methodInfo.icon]

  return (
    <div className="pos-scroll min-h-0 flex-1 overflow-y-auto px-4 pb-5 pt-4 sm:px-5">
      <StepHeader t={t} onBack={onBack} title={t.pinTitle} subtitle={t.pinSub} />

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-center">
        <p className="text-[7px] uppercase tracking-[0.28em] text-white/30">{t.amountPaid}</p>
        <p className="mt-1 font-display text-[32px] leading-none tabular-nums text-[#fff1d3]">
          {money(total)}
        </p>
        <div className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[8px] text-white/55">
          <MethodIcon size={10} strokeWidth={1.8} style={{ color: methodInfo.color }} />
          {methodLabel(method, lang)}
        </div>
      </div>

      <div className="mt-5">
        <motion.div
          key={errorKey}
          animate={pinError ? { x: [0, -8, 8, -6, 6, -2, 0] } : { x: 0 }}
          transition={{ duration: 0.42 }}
          className="flex justify-center gap-2"
        >
          {Array.from({ length: 6 }).map((_, index) => {
            const filled = index < pin.length
            return (
              <div
                key={index}
                className={`flex h-11 w-9 items-center justify-center rounded-xl border transition ${
                  pinError
                    ? 'border-rose-400/50 bg-rose-400/10'
                    : filled
                      ? 'border-emerald-300/35 bg-emerald-300/8'
                      : 'border-white/10 bg-white/[0.035]'
                }`}
              >
                {filled ? (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="h-2 w-2 rounded-full bg-[#fff3dd] shadow-[0_0_12px_rgba(255,243,221,0.7)]"
                  />
                ) : (
                  <span className="h-1 w-1 rounded-full bg-white/15" />
                )}
              </div>
            )
          })}
        </motion.div>

        <div className="mt-2.5 h-4 text-center">
          <AnimatePresence mode="wait">
            {pinError ? (
              <motion.p
                key="pin-error"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                className="text-[9px] tracking-wide text-rose-300/90"
                role="alert"
              >
                {t.wrongPin}
              </motion.p>
            ) : (
              <motion.p
                key="pin-hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center gap-1.5 text-[8px] uppercase tracking-[0.16em] text-white/25"
              >
                <LockKeyhole size={9} strokeWidth={1.7} />
                {t.demoPin}
                <span className="font-mono text-[9px] tracking-[0.24em] text-amber-200/65">
                  123456
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        <div className="mx-auto mt-3 grid max-w-[278px] grid-cols-3 gap-2">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <motion.button
              key={digit}
              type="button"
              whileTap={{ scale: 0.93 }}
              disabled={processing}
              onClick={() => onDigit(digit)}
              className="pin-key flex h-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.045] text-lg font-light text-white/85 transition hover:border-white/15 hover:bg-white/[0.08] disabled:opacity-40"
            >
              {digit}
            </motion.button>
          ))}
          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            disabled={processing}
            onClick={onClear}
            className="pin-key flex h-12 items-center justify-center rounded-2xl border border-white/6 bg-transparent text-[9px] uppercase tracking-[0.18em] text-white/35 transition hover:text-white/60 disabled:opacity-40"
          >
            {t.clear}
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            disabled={processing}
            onClick={() => onDigit('0')}
            className="pin-key flex h-12 items-center justify-center rounded-2xl border border-white/8 bg-white/[0.045] text-lg font-light text-white/85 transition hover:border-white/15 hover:bg-white/[0.08] disabled:opacity-40"
          >
            0
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.93 }}
            disabled={processing}
            onClick={onBackspace}
            aria-label={t.backspace}
            className="pin-key flex h-12 items-center justify-center rounded-2xl border border-white/6 bg-transparent text-white/40 transition hover:text-white/70 disabled:opacity-40"
          >
            <Delete size={17} strokeWidth={1.6} />
          </motion.button>
        </div>

        <p className="mt-4 flex items-center justify-center gap-1.5 text-[7.5px] uppercase tracking-[0.22em] text-white/22">
          <ShieldCheck size={10} strokeWidth={1.7} />
          {t.secure}
        </p>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                                 Success step                               */
/* -------------------------------------------------------------------------- */

const CONFETTI = Array.from({ length: 18 }, (_, index) => {
  const angle = (index / 18) * Math.PI * 2
  const radius = 58 + (index % 5) * 16
  return {
    id: index,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius - 22,
    rotate: (index % 2 ? 1 : -1) * (90 + index * 18),
    color: ['#f6c46a', '#6ee7b7', '#f9a8d4', '#fde68a'][index % 4],
    size: 3 + (index % 3),
    delay: (index % 6) * 0.02,
  }
})

function DetailRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[8.5px] uppercase tracking-[0.16em] text-white/30">{label}</span>
      <span className="text-right text-[10px] tracking-wide text-white/70">{value}</span>
    </div>
  )
}

function SuccessStep({
  t,
  lang,
  total,
  method,
  orderNo,
  orderType,
  autoCount,
  onFinish,
}) {
  return (
    <div className="pos-scroll relative min-h-0 flex-1 overflow-y-auto px-4 pb-6 pt-6 sm:px-5">
      <div className="pointer-events-none absolute left-1/2 top-16 z-0 h-1 w-1">
        {CONFETTI.map((piece) => (
          <motion.span
            key={piece.id}
            className="absolute rounded-full"
            style={{
              width: piece.size,
              height: piece.size,
              background: piece.color,
              boxShadow: `0 0 10px ${piece.color}88`,
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{
              x: piece.x,
              y: piece.y,
              opacity: 0,
              scale: 0.5,
              rotate: piece.rotate,
            }}
            transition={{ duration: 1.35, delay: 0.15 + piece.delay, ease: 'easeOut' }}
          />
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <motion.div
          className="relative flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400 text-[#03120b] shadow-[0_0_60px_rgba(52,211,153,0.45)]"
          initial={{ scale: 0.35, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 320, damping: 18 }}
        >
          <motion.span
            className="absolute inset-0 rounded-full border border-emerald-200/50"
            animate={{ scale: [1, 1.45], opacity: [0.7, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
          />
          <Check size={38} strokeWidth={2.6} />
        </motion.div>

        <p className="mt-4 flex items-center gap-1.5 text-[8px] uppercase tracking-[0.3em] text-emerald-300/70">
          <ReceiptText size={10} strokeWidth={1.8} />
          {t.receipt}
        </p>
        <h2 className="mt-1 font-tc text-2xl tracking-[0.14em] text-[#fff3dd]">
          {t.successTitle}
        </h2>
        <p className="mt-1 text-[10px] tracking-wide text-white/40">{t.successSub}</p>

        <div className="mt-5 w-full rounded-2xl border border-white/10 bg-white/[0.045] p-4 text-left">
          <div className="flex items-end justify-between gap-3 border-b border-dashed border-white/10 pb-3">
            <div>
              <p className="text-[7px] uppercase tracking-[0.24em] text-white/30">{t.amountPaid}</p>
              <p className="mt-1 font-display text-[28px] leading-none tabular-nums text-[#fff1d3]">
                {money(total)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[7px] uppercase tracking-[0.22em] text-white/30">{t.pickup}</p>
              <p className="mt-1 font-display text-xl tracking-wider text-amber-200/90">
                A-{orderNo.slice(-3)}
              </p>
            </div>
          </div>

          <div className="mt-3 space-y-2.5">
            <DetailRow label={t.orderNo} value={orderNo} />
            <DetailRow label={t.method} value={methodLabel(method, lang)} />
            <DetailRow
              label={t.orderType}
              value={orderType === 'takeaway' ? t.takeaway : t.dineIn}
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 border-t border-white/8 pt-3 text-[8px] tracking-wide text-emerald-200/60">
            <ShieldCheck size={10} strokeWidth={1.7} />
            {t.secure}
          </div>
        </div>

        <p className="mt-4 font-tc text-[11px] tracking-[0.18em] text-amber-100/50">{t.thanks}</p>
      </div>

      <div className="relative z-10 mt-5">
        <div className="flex items-center justify-between text-[7.5px] uppercase tracking-[0.2em] text-white/30">
          <span>{t.backToMarket}</span>
          <span>
            {autoCount}
            {lang === 'zh' ? '' : ' '}
            {t.autoReturn}
          </span>
        </div>
        <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-white/8">
          <motion.div
            className="h-full rounded-full bg-emerald-400"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 5.2, ease: 'linear' }}
          />
        </div>
        <motion.button
          type="button"
          whileTap={{ scale: 0.985 }}
          onClick={onFinish}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-white/12 bg-white/[0.055] py-3 text-[10px] uppercase tracking-[0.2em] text-white/70 transition hover:bg-white/[0.09] hover:text-white"
        >
          {t.backToMarket}
          <ArrowRight size={12} strokeWidth={2} />
        </motion.button>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*                               Processing veil                              */
/* -------------------------------------------------------------------------- */

function ProcessingVeil({ open, t }) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#060a0e]/92 px-8 text-center backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="relative flex h-16 w-16 items-center justify-center">
            <motion.span
              className="absolute inset-0 rounded-full border border-emerald-300/25"
              animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.span
              className="absolute inset-0 rounded-full border border-dashed border-emerald-300/30"
              animate={{ rotate: 360 }}
              transition={{ duration: 9, repeat: Infinity, ease: 'linear' }}
            />
            <Loader2 size={26} strokeWidth={1.6} className="animate-spin text-emerald-300" />
          </div>
          <h3 className="mt-4 font-tc text-lg tracking-[0.14em] text-[#fff1d8]">{t.processing}</h3>
          <p className="mt-1.5 max-w-[240px] text-[9px] leading-relaxed tracking-wide text-white/35">
            {t.processingSub}
          </p>
          <div className="mt-5 flex gap-1.5">
            {[0, 1, 2].map((index) => (
              <motion.span
                key={index}
                className="h-1.5 w-1.5 rounded-full bg-emerald-300/70"
                animate={{ opacity: [0.2, 1, 0.2] }}
                transition={{ duration: 1.1, repeat: Infinity, delay: index * 0.18 }}
              />
            ))}
          </div>
          <p className="mt-6 flex items-center gap-1.5 text-[7.5px] uppercase tracking-[0.24em] text-white/22">
            <ShieldCheck size={10} strokeWidth={1.7} />
            {t.secure}
          </p>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}

/* -------------------------------------------------------------------------- */
/*                                  POS shell                                 */
/* -------------------------------------------------------------------------- */

export default function PosOverlay({ open, onClose, onComplete }) {
  const [lang, setLang] = useState('zh')
  const [step, setStep] = useState('menu')
  const [loading, setLoading] = useState(true)
  const [cart, setCart] = useState({})
  const [category, setCategory] = useState('all')
  const [method, setMethod] = useState('alipay')
  const [sheetOpen, setSheetOpen] = useState(false)
  const [pin, setPin] = useState('')
  const [pinError, setPinError] = useState(false)
  const [errorKey, setErrorKey] = useState(0)
  const [processing, setProcessing] = useState(false)
  const [orderType, setOrderType] = useState('dine')
  const [orderNo, setOrderNo] = useState(newOrderNo)
  const [autoCount, setAutoCount] = useState(5)

  const verifyingRef = useRef(false)
  const finishedRef = useRef(false)
  const finishRef = useRef(null)

  const t = POS_COPY[lang]

  const cartItems = useMemo(
    () =>
      MENU.filter((item) => (cart[item.id] ?? 0) > 0).map((item) => ({
        item,
        quantity: cart[item.id],
      })),
    [cart],
  )

  const count = cartItems.reduce((sum, entry) => sum + entry.quantity, 0)
  const subtotal = cartItems.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0,
  )
  const total = subtotal
  const visibleItems = useMemo(
    () => (category === 'all' ? MENU : MENU.filter((item) => item.category === category)),
    [category],
  )

  const addItem = useCallback((id) => {
    setCart((current) => ({ ...current, [id]: (current[id] ?? 0) + 1 }))
  }, [])

  const removeItem = useCallback((id) => {
    setCart((current) => {
      const next = { ...current }
      const quantity = (next[id] ?? 0) - 1
      if (quantity <= 0) delete next[id]
      else next[id] = quantity
      return next
    })
  }, [])

  const finish = useCallback(() => {
    if (finishedRef.current) return
    finishedRef.current = true
    onComplete({
      total,
      method,
      methodLabel: methodLabel(method, lang),
      orderNo,
      lang,
    })
  }, [lang, method, onComplete, orderNo, total])

  useEffect(() => {
    finishRef.current = finish
  }, [finish])

  const requestClose = useCallback(() => {
    if (processing) return
    if (sheetOpen) {
      setSheetOpen(false)
      return
    }
    if (step === 'success') {
      finish()
      return
    }
    onClose()
  }, [finish, onClose, processing, sheetOpen, step])

  /* Reset the terminal each time the overlay is opened. */
  useEffect(() => {
    if (!open) return undefined

    setStep('menu')
    setLoading(true)
    setCart({})
    setCategory('all')
    setMethod('alipay')
    setSheetOpen(false)
    setPin('')
    setPinError(false)
    setErrorKey(0)
    setProcessing(false)
    setOrderType('dine')
    setOrderNo(newOrderNo())
    setAutoCount(5)
    verifyingRef.current = false
    finishedRef.current = false

    const timer = window.setTimeout(() => setLoading(false), 1150)
    return () => window.clearTimeout(timer)
  }, [open])

  /* Lock background scroll while the terminal is open. */
  useEffect(() => {
    if (!open) return undefined
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  /* Escape closes the sheet first, then the terminal. */
  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        requestClose()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, requestClose])

  /* Physical keyboard support for the PIN pad. */
  const pushDigit = useCallback(
    (digit) => {
      if (processing) return
      setPinError(false)
      setPin((current) => (current.length >= 6 ? current : current + digit))
    },
    [processing],
  )

  const popDigit = useCallback(() => {
    if (processing) return
    setPinError(false)
    setPin((current) => current.slice(0, -1))
  }, [processing])

  const clearPin = useCallback(() => {
    if (processing) return
    setPinError(false)
    setPin('')
  }, [processing])

  useEffect(() => {
    if (!open || step !== 'pin') return undefined
    const onKeyDown = (event) => {
      if (/^\d$/.test(event.key)) {
        event.preventDefault()
        pushDigit(event.key)
      } else if (event.key === 'Backspace') {
        event.preventDefault()
        popDigit()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open, step, pushDigit, popDigit])

  /* Verify the PIN only when all six digits have been entered. */
  useEffect(() => {
    if (step !== 'pin' || pin.length !== 6 || verifyingRef.current) return undefined

    verifyingRef.current = true
    let processTimer = null

    const verifyTimer = window.setTimeout(() => {
      if (pin === '123456') {
        setProcessing(true)
        processTimer = window.setTimeout(() => {
          setProcessing(false)
          setPin('')
          setStep('success')
        }, 1450)
      } else {
        setPin('')
        setPinError(true)
        setErrorKey((current) => current + 1)
        verifyingRef.current = false
        window.setTimeout(() => setPinError(false), 1400)
      }
    }, 320)

    return () => {
      window.clearTimeout(verifyTimer)
      if (processTimer) window.clearTimeout(processTimer)
    }
  }, [pin, step])

  /* Auto-redirect back to the night market after a successful payment. */
  useEffect(() => {
    if (!open || step !== 'success') return undefined

    setAutoCount(5)
    const interval = window.setInterval(() => {
      setAutoCount((current) => Math.max(1, current - 1))
    }, 1000)
    const timer = window.setTimeout(() => finishRef.current?.(), 5200)

    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timer)
    }
  }, [open, step])

  const handleSheetConfirm = (selectedMethod) => {
    setMethod(selectedMethod)
    setSheetOpen(false)
    setPin('')
    setPinError(false)
    verifyingRef.current = false
    setStep('pin')
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-end justify-center sm:items-center sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <button
            type="button"
            aria-label={t.close}
            tabIndex={-1}
            className="absolute inset-0 cursor-default bg-[#030507]/78 backdrop-blur-lg"
            onClick={requestClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Chinese Night Market Smart POS"
            className="liquid-shell relative z-10 flex h-[93dvh] w-full flex-col overflow-hidden rounded-t-[30px] border border-white/12 sm:h-[min(880px,88dvh)] sm:w-[432px] sm:rounded-[34px]"
            initial={{ y: '100%', opacity: 0.5, scale: 0.99 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: '104%', opacity: 0.3 }}
            transition={{ type: 'spring', stiffness: 290, damping: 32 }}
          >
            <img
              src="/scenes/nightmarket-1600.webp"
              alt=""
              className="pointer-events-none absolute inset-0 h-full w-full scale-110 object-cover opacity-[0.16] blur-2xl"
            />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#0a0f14]/65 via-[#080b10]/80 to-[#07090d]/95" />
            <div className="pointer-events-none absolute -right-24 -top-20 h-64 w-64 rounded-full bg-emerald-400/10 blur-3xl" />
            <div className="pointer-events-none absolute -left-24 top-1/3 h-56 w-56 rounded-full bg-amber-300/8 blur-3xl" />

            <div className="relative z-20 mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-white/20 sm:mt-2.5" />

            <header className="relative z-20 flex shrink-0 items-center justify-between gap-2 border-b border-white/8 px-4 pb-3 pt-3 sm:px-5">
              <div className="flex min-w-0 items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-amber-200/20 bg-gradient-to-br from-amber-200/15 to-emerald-300/8 text-amber-200">
                  <Store size={17} strokeWidth={1.7} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="font-tc text-[14px] tracking-[0.12em] text-[#fff4de]">
                      {t.brand}
                    </span>
                    <span className="truncate text-[6.5px] uppercase tracking-[0.2em] text-white/28">
                      {t.brandSub}
                    </span>
                  </div>
                  <p className="mt-0.5 flex items-center gap-1.5 truncate text-[8px] tracking-wide text-white/38">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-emerald-300 shadow-[0_0_7px_rgba(110,231,183,0.85)]" />
                    {t.open}
                    <span className="text-white/18">·</span>
                    <span className="truncate">{t.stallMeta}</span>
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1.5">
                <div className="flex items-center rounded-full border border-white/10 bg-white/5 p-0.5">
                  <button
                    type="button"
                    onClick={() => setLang('zh')}
                    aria-pressed={lang === 'zh'}
                    className={`rounded-full px-2 py-1 text-[8.5px] tracking-wide transition ${
                      lang === 'zh'
                        ? 'bg-white/14 text-white'
                        : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    中文
                  </button>
                  <button
                    type="button"
                    onClick={() => setLang('en')}
                    aria-pressed={lang === 'en'}
                    className={`rounded-full px-2 py-1 text-[8.5px] tracking-wide transition ${
                      lang === 'en'
                        ? 'bg-white/14 text-white'
                        : 'text-white/35 hover:text-white/60'
                    }`}
                  >
                    EN
                  </button>
                </div>

                <button
                  type="button"
                  onClick={requestClose}
                  aria-label={t.close}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/45 transition hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-200/60"
                >
                  <X size={13} strokeWidth={1.8} />
                </button>
              </div>
            </header>

            <div className="relative z-10 flex min-h-0 flex-1 flex-col">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={step}
                  className="flex min-h-0 flex-1 flex-col"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 'menu' ? (
                    loading ? (
                      <MenuSkeleton t={t} />
                    ) : (
                      <MenuStep
                        t={t}
                        lang={lang}
                        cart={cart}
                        addItem={addItem}
                        removeItem={removeItem}
                        category={category}
                        setCategory={setCategory}
                        visibleItems={visibleItems}
                        count={count}
                        total={total}
                        onCheckout={() => {
                          if (count > 0) setStep('pay')
                        }}
                      />
                    )
                  ) : null}

                  {step === 'pay' ? (
                    <ReviewStep
                      t={t}
                      lang={lang}
                      cartItems={cartItems}
                      count={count}
                      subtotal={subtotal}
                      total={total}
                      orderType={orderType}
                      setOrderType={setOrderType}
                      onBack={() => setStep('menu')}
                      onChoosePayment={() => setSheetOpen(true)}
                      method={method}
                    />
                  ) : null}

                  {step === 'pin' ? (
                    <PinStep
                      t={t}
                      lang={lang}
                      total={total}
                      method={method}
                      pin={pin}
                      pinError={pinError}
                      errorKey={errorKey}
                      processing={processing}
                      onDigit={pushDigit}
                      onBackspace={popDigit}
                      onClear={clearPin}
                      onBack={() => {
                        setPin('')
                        setPinError(false)
                        verifyingRef.current = false
                        setStep('pay')
                      }}
                    />
                  ) : null}

                  {step === 'success' ? (
                    <SuccessStep
                      t={t}
                      lang={lang}
                      total={total}
                      method={method}
                      orderNo={orderNo}
                      orderType={orderType}
                      autoCount={autoCount}
                      onFinish={finish}
                    />
                  ) : null}
                </motion.div>
              </AnimatePresence>
            </div>

            <PaymentSheet
              open={sheetOpen}
              lang={lang}
              t={t}
              selected={method}
              onSelect={setMethod}
              onConfirm={handleSheetConfirm}
              onClose={() => setSheetOpen(false)}
              total={total}
            />

            <ProcessingVeil open={processing} t={t} />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  )
}
