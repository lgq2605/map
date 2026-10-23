import { motion } from 'framer-motion'
import type { Figure } from '../data/types'
import Visual from './Visual'
export default function FigureCard({ f }: { f: Figure }) {
  return (
    <motion.section initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
      className="mt-8 rounded-2xl border border-gold/40 bg-white/5 p-5 shadow-[0_0_30px_#ffcd0022]">
      <h3 className="font-serif text-2xl font-semibold text-gold glow">👤 {f.name}</h3>
      {/* fit contain: hiện TRỌN VẸN ảnh chân dung (không cắt mất đầu/thân như object-cover) */}
      <div className="mt-3"><Visual src={f.image} query={f.query} caption={f.name} fit="contain" /></div>
      <ul className="mt-3 space-y-2 leading-relaxed">{f.lines.map(l => <li key={l}>{l}</li>)}</ul>
    </motion.section>
  )
}
