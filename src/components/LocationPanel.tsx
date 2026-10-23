import { useState } from 'react'
import { motion } from 'framer-motion'
import type { LocationData } from '../data/types'
import TimelineStep from './TimelineStep'
import FigureCard from './FigureCard'
import { useFollowScroll } from './useAutoScroll'

// Điện thoại: bảng trượt từ dưới lên (58% màn hình). Máy tính/tablet ngang: bảng bên phải.
export const panelCls = 'absolute inset-x-0 bottom-0 z-10 h-[58%] overflow-y-auto rounded-t-2xl bg-navy/90 p-5 backdrop-blur md:inset-y-0 md:left-auto md:right-0 md:h-full md:w-full md:max-w-md md:rounded-none md:p-6 md:pt-20'
export const slide = () => (matchMedia('(min-width: 768px)').matches ? { x: '100%' } : { y: '100%' })
export const backCls = 'rounded-full border border-paper/30 px-4 py-2 text-sm transition duration-200 hover:scale-105'

export default function LocationPanel({ data, onBack }: { data: LocationData; onBack: () => void }) {
  const [step, setStep] = useState(0)
  // Cuộn riêng khung bảng (scrollIntoView có thể làm cả trang bị xô lệch trên điện thoại)
  const { box, inner } = useFollowScroll(step)
  return (
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0 }} className={panelCls}>
      <div ref={inner}>
        <button onClick={onBack} className={backCls}>← Quay lại chọn địa điểm</button>
        <h2 className="my-5 font-serif text-3xl font-extrabold text-gold glow">{data.title}</h2>
        <ol className="ml-2 space-y-8 border-l-2 border-vred pl-6">
          {data.milestones.slice(0, Math.min(step, 3) + 1).map((m, i) => (
            <TimelineStep key={i} m={m} active={i === step} isLast={i === 3} onNext={() => setStep(step + 1)} />
          ))}
        </ol>
        {step >= 4 && <FigureCard f={data.figure} />}
      </div>
    </motion.aside>
  )
}
