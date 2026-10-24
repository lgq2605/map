import { useRef } from 'react'
import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { ArrowRight } from './Icons'
import { useCommonsImage } from './useCommonsImage'
import { useInViewOnce } from './useInViewOnce'
import { namKy } from '../data/namKy'
type Pick = 'hue' | 'du' | 'namky'

// Ba con đường ở TP. Hồ Chí Minh (tiêu đề giữ nguyên chữ + emoji vì là nội dung)
const ROADS: { id: Pick; title: string; sub?: string; src?: string; query?: string[] }[] = [
  { id: 'hue', title: '🛣️ Đường Nguyễn Huệ', query: ['Nguyễn Huệ pedestrian street Ho Chi Minh City', 'Nguyễn Huệ street'] },
  { id: 'du', title: '🏫 Trường THCS và THPT Trần Đại Nghĩa', sub: '53 Nguyễn Du · TP. Hồ Chí Minh', query: ['Trường THCS và THPT Trần Đại Nghĩa', 'Taberd school'] },
  { id: 'namky', title: '🔥 Đường Nam Kỳ Khởi Nghĩa', src: namKy.naming.image },
]

// Ảnh thu nhỏ: zoom 1.05 khi rê chuột + lớp phủ gradient từ dưới lên. Không có ảnh thì dùng nền gradient đỏ–navy.
function Thumb({ src, query }: { src?: string; query?: string[] }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useInViewOnce(ref)
  const { img, fail, canFail } = useCommonsImage(query, src, seen)
  return (
    <div ref={ref} aria-hidden="true" className="relative hidden h-24 overflow-hidden rounded-t-[0.9rem] bg-gradient-to-br from-vred/60 to-navy2 md:block">
      {img && <img src={img.url} alt="" loading="lazy" onError={() => canFail && fail()} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />}
      <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/30 to-transparent" />
    </div>
  )
}

const stagger = { show: { transition: { staggerChildren: 0.12 } } }
const item = { hidden: { x: -60, opacity: 0 }, show: { x: 0, opacity: 1 } }

export default function ChoiceModal({ onPick }: { onPick: (p: Pick) => void }) {
  return (
    <motion.div variants={stagger} initial="hidden" animate="show" className="absolute inset-x-3 bottom-3 z-10 space-y-2 md:inset-x-auto md:bottom-auto md:left-4 md:top-4 md:w-80 md:space-y-4">
      {ROADS.map((r, i) => (
        <motion.div key={r.id} variants={item}>
          <TiltCard>
            <button className="no-fx glass-card group relative block w-full overflow-hidden text-left" onClick={() => onPick(r.id)}>
              <Thumb src={r.src} query={r.query} />
              {/* Số thứ tự lớn, mờ */}
              <span aria-hidden="true" className="pointer-events-none absolute left-3 top-1 select-none font-display text-5xl font-bold leading-none text-gold/40 md:text-6xl">{String(i + 1).padStart(2, '0')}</span>
              <div className="p-3 pl-16 md:p-4 md:pl-4">
                <div className="font-serif text-xl font-bold tracking-[0.02em] text-gold">{r.title}</div>
                <div className="text-sm text-paper/75">{r.sub ?? 'TP. Hồ Chí Minh'}</div>
                <div className="explore mt-2">Khám phá <ArrowRight width={16} height={16} /></div>
              </div>
            </button>
          </TiltCard>
        </motion.div>
      ))}
    </motion.div>
  )
}
