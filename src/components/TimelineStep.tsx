import { useState } from 'react'
import { motion } from 'framer-motion'
import type { Milestone } from '../data/types'
import { useTypewriter } from './useTypewriter'
import Visual from './Visual'
import Highlight from './Highlight'
import CountUp from './CountUp'
import NextButton from './NextButton'
import { Chevron } from './Icons'

// Mốc cũ (đã xem) thu gọn thành tiêu đề, bấm để mở lại (accordion dọc); mốc đang xem luôn mở.
export default function TimelineStep({ m, active, isLast, onNext }: { m: Milestone; active: boolean; isLast: boolean; onNext: () => void }) {
  const { text, done } = useTypewriter(m.text, active)
  const [open, setOpen] = useState(false)
  const expanded = active || open
  const digits = m.year.match(/\d{4}/)?.[0]
  const tone = digits && +digits >= 2000 ? 'modern' : 'history' // ảnh hiện đại: vàng/đen · ảnh lịch sử: đỏ/đen
  return (
    <motion.li layout initial={{ x: 80, opacity: 0, scale: 0.96 }} animate={{ x: 0, opacity: 1, scale: 1 }} transition={{ type: 'spring', stiffness: 130, damping: 20 }} className="relative">
      <span className="absolute -left-[1.9rem] top-5 h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_#ffcd00]" />
      <article className="relative overflow-hidden rounded-xl border border-gold/20 bg-white/[0.04] p-4 backdrop-blur-sm">
        {/* Số năm khổng lồ làm watermark phía sau chữ (đếm từ 0 khi vào khung nhìn) */}
        {digits && <div aria-hidden="true" className="pointer-events-none absolute -right-2 -top-3 select-none font-num text-[6.5rem] leading-none tracking-wide text-gold/20 md:text-[7.5rem]"><CountUp to={+digits} pad={4} /></div>}
        <h3 className="relative font-serif text-2xl font-bold tracking-[0.02em]">
          {active
            ? <span className="gold-text">{m.year}</span>
            : <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open} className="no-fx flex items-center gap-2 text-gold hover:brightness-125">{m.year}<Chevron width={18} height={18} className={'transition-transform ' + (open ? 'rotate-180' : '')} /></button>}
        </h3>
        <motion.div initial={false} animate={{ height: expanded ? 'auto' : 0, opacity: expanded ? 1 : 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }} className="relative">
          <div className="space-y-4 pt-3">
            <Visual src={m.image} query={m.query} caption={m.visual} tone={tone} />
            <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="leading-[1.7]">
              <Highlight text={m.text} shown={text.length} />
            </motion.p>
            {active && done && <NextButton label={isLast ? 'Xem nhân vật' : 'Tiếp theo'} onClick={onNext} />}
          </div>
        </motion.div>
      </article>
    </motion.li>
  )
}
