import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
import type { LocationData } from '../data/types'
import TimelineStep from './TimelineStep'
import FigureCard from './FigureCard'
import { useFollowScroll } from './useAutoScroll'

// Điện thoại: bảng trượt từ dưới lên (58% màn hình). Máy tính/tablet ngang: bảng bên phải.
export const panelCls = 'absolute inset-x-0 bottom-0 z-10 h-[58%] overflow-y-auto rounded-t-2xl border-t border-gold/25 bg-navy/95 p-5 shadow-[0_-8px_24px_rgba(0,0,0,.5)] md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-md md:rounded-none md:border-l md:border-t-0 md:p-6 md:pt-20'
export const slide = () => (matchMedia('(min-width: 768px)').matches ? { x: '100%', opacity: 0 } : { y: '100%', opacity: 0 })

// Trục thời gian dọc (vàng → đỏ) + chấm sáng chạy theo vị trí cuộn của bảng
function useAxisDot(box: React.RefObject<HTMLElement | null>) {
  const wrap = useRef<HTMLDivElement>(null)
  const raw = useMotionValue(0)
  const y = useSpring(raw, { stiffness: 120, damping: 22 })
  useEffect(() => {
    const b = box.current, w = wrap.current
    if (!b || !w) return
    // Gộp theo khung hình (rAF): không đo layout dồn dập khi bảng đang tự cuộn theo chữ gõ
    let raf = 0
    const measure = () => {
      raf = 0
      const wr = w.getBoundingClientRect(), br = b.getBoundingClientRect()
      raw.set(Math.max(0, Math.min(wr.height, br.top + b.clientHeight * 0.5 - wr.top)))
    }
    const update = () => { if (!raf) raf = requestAnimationFrame(measure) }
    update()
    b.addEventListener('scroll', update, { passive: true })
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(update) : null
    ro?.observe(w)
    return () => { cancelAnimationFrame(raf); b.removeEventListener('scroll', update); ro?.disconnect() }
  }, [])
  return { wrap, y }
}
export const backCls = 'glass-pill min-h-11 rounded-full px-4 py-2 text-sm'
// Nút hiện sau khi xem hết thông tin: quay về màn chọn 1 trong 3 con đường
export const againCls = 'mt-8 min-h-11 w-full rounded-full bg-gradient-to-r from-gold to-[#ffb800] px-4 py-3 font-semibold text-navy transition duration-200 hover:brightness-105'

export default function LocationPanel({ data, onBack, onStep }: { data: LocationData; onBack: () => void; onStep?: (step: number) => void }) {
  const [step, setStep] = useState(0)
  // Chuyển mốc: báo lại cho bản đồ (đường Nguyễn Du thay khung nhìn theo mốc)
  const go = (s: number) => { setStep(s); onStep?.(s) }
  // Cuộn riêng khung bảng (scrollIntoView có thể làm cả trang bị xô lệch trên điện thoại)
  const { box, inner } = useFollowScroll(step)
  const { wrap, y } = useAxisDot(box)
  return (
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} className={panelCls}>
      <div ref={inner}>
        <button onClick={onBack} className={backCls}>← Chọn địa điểm khác</button>
        <h2 className="my-5 font-serif text-3xl font-extrabold leading-tight tracking-[0.02em]"><span className="gold-text">{data.title}</span></h2>
        <div ref={wrap} className="relative ml-2 pl-6">
          <div aria-hidden="true" className="axis absolute bottom-0 left-0 top-0 w-[2px] rounded-full" />
          <motion.span aria-hidden="true" className="axis-dot" style={{ y, top: 0 }} />
          <ol className="space-y-8">
            {data.milestones.slice(0, Math.min(step, 3) + 1).map((m, i) => (
              <TimelineStep key={i} m={m} active={i === step} isLast={i === 3} onNext={() => go(step + 1)} />
            ))}
          </ol>
        </div>
        {step >= 4 && <FigureCard f={data.figure} />}
        {/* Xem hết thông tin (cả nhân vật): nút quay lại màn chọn 3 con đường */}
        {step >= 4 && (
          <motion.button initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} onClick={onBack} className={againCls}>
            Quay lại
          </motion.button>
        )}
      </div>
    </motion.aside>
  )
}
