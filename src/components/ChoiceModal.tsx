import { motion } from 'framer-motion'
type Pick = 'hue' | 'du' | 'namky'
const card = 'w-full rounded-2xl border border-gold/30 bg-navy/85 p-3 text-left backdrop-blur md:p-5 transition duration-200 hover:scale-105 hover:border-gold'
// Ba con đường ở TP. Hồ Chí Minh
const ROADS: { id: Pick; title: string }[] = [
  { id: 'hue', title: '🛣️ Đường Nguyễn Huệ' },
  { id: 'du', title: '🏫 Đường Nguyễn Du' },
  { id: 'namky', title: '🔥 Đường Nam Kỳ Khởi Nghĩa' },
]
export default function ChoiceModal({ onPick }: { onPick: (p: Pick) => void }) {
  return (
    <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute inset-x-3 bottom-3 z-10 space-y-2 md:inset-x-auto md:bottom-auto md:left-4 md:top-4 md:w-80 md:space-y-4">
      {ROADS.map(r => (
        <button key={r.id} className={card} onClick={() => onPick(r.id)}>
          <div className="font-serif text-xl text-gold">{r.title}</div>
          <div className="text-sm text-paper/70">TP. Hồ Chí Minh</div>
          <div className="mt-1 font-semibold text-gold md:mt-2">Khám phá ➡️</div>
        </button>
      ))}
    </motion.div>
  )
}
