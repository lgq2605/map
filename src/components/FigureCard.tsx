import { useEffect } from 'react'
import { motion } from 'framer-motion'
import type { Figure } from '../data/types'
import Visual from './Visual'
import Highlight from './Highlight'
import Ornament from './Ornament'
import { CalendarIcon, iconForEmoji } from './Icons'
import { unroll } from '../audio'

// Chữ Hán/Nôm mờ làm watermark phía sau (theo tên nhân vật; không khớp thì dùng chữ "史" = sử).
const HAN = (name: string) => name.includes('Quang Trung') ? '光中' : name.includes('Trần Đại Nghĩa') ? '陳大義' : '史'
// Tách emoji đầu dòng (🏡 👨‍👩‍👦 ✏️ ⭐) để thay bằng icon SVG mảnh
const EMOJI = /^(\p{Extended_Pictographic}[\u200d\ufe0f\p{Extended_Pictographic}]*)\s*/u

// "Hồ sơ bảo tàng": giấy cũ + chân dung khung vàng kép + tên Cinzel vàng + hoa văn; mở ra như cuộn giấy.
export default function FigureCard({ f }: { f: Figure }) {
  useEffect(() => { unroll() }, [])
  const [first, ...rest] = f.lines
  return (
    <motion.section initial={{ opacity: 0, scaleY: 0 }} animate={{ opacity: 1, scaleY: 1 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} style={{ originY: 0 }}
      className="paper relative mt-8 overflow-hidden rounded-lg border border-gold/40 shadow-[0_12px_30px_rgba(0,0,0,.5)]">
      {/* hai trục cuộn trên/dưới */}
      <div aria-hidden="true" className="h-2 bg-gradient-to-b from-[#ffe58a] via-gold to-[#8a6a00]" />
      <div aria-hidden="true" className="pointer-events-none absolute right-2 top-10 select-none text-[8rem] leading-none text-gold/[0.08]" style={{ fontFamily: '"Noto Serif TC", serif', fontWeight: 700 }}>{HAN(f.name)}</div>
      <div className="relative p-5">
        <p className="font-sub text-xs font-semibold uppercase tracking-[0.35em] text-vred" style={{ color: '#ff6a5e' }}>Hồ sơ nhân vật</p>
        <div className="mt-3 flex flex-col gap-4 sm:flex-row">
          {/* fit contain: hiện TRỌN VẸN ảnh chân dung (không cắt mất đầu/thân như object-cover) */}
          <div className="w-full flex-none px-1.5 sm:w-36"><Visual src={f.image} query={f.query} caption={f.name} fit="contain" variant="portrait" /></div>
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-2xl font-bold leading-tight tracking-[0.04em]"><span className="gold-text">{f.name}</span></h3>
            <Ornament className="mt-2 h-4 w-full max-w-[16rem]" />
            {first && <p className="mt-3 flex items-start gap-2 text-[15px] text-paper/90"><CalendarIcon className="mt-1 flex-none text-gold" width={18} height={18} /><span><Highlight text={first} /></span></p>}
          </div>
        </div>
        <ul className="mt-5 space-y-3">
          {rest.map(l => {
            const m = l.match(EMOJI)
            const Icon = m ? iconForEmoji(m[1]) : CalendarIcon
            return (
              <motion.li key={l} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="grid grid-cols-[1.4rem_1fr] items-start gap-3 text-[15px] leading-[1.7]">
                <Icon className="mt-1 text-gold" width={18} height={18} />
                <span><Highlight text={m ? l.slice(m[0].length) : l} /></span>
              </motion.li>
            )
          })}
        </ul>
      </div>
      <div aria-hidden="true" className="h-2 bg-gradient-to-b from-[#8a6a00] via-gold to-[#ffe58a]" />
    </motion.section>
  )
}
