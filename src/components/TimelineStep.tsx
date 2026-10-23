import { motion } from 'framer-motion'
import type { Milestone } from '../data/types'
import { useTypewriter } from './useTypewriter'
import Visual from './Visual'

export default function TimelineStep({ m, active, isLast, onNext }: { m: Milestone; active: boolean; isLast: boolean; onNext: () => void }) {
  const { text, done } = useTypewriter(m.text, active)
  return (
    <motion.li initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="relative space-y-3">
      <span className="absolute -left-[1.9rem] top-2 h-3 w-3 rounded-full bg-gold shadow-[0_0_12px_#ffcd00]" />
      <h3 className="font-serif text-2xl font-semibold text-gold glow">{m.year}</h3>
      <Visual src={m.image} query={m.query} caption={m.visual} />
      <p className="leading-relaxed">{text}</p>
      {active && done && (
        <motion.button animate={{ x: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1 }} onClick={onNext}
          className="min-h-11 rounded-full bg-gold px-4 py-2 font-semibold text-navy transition duration-200 hover:scale-105">
          {isLast ? 'Xem nhân vật' : 'Tiếp theo'} ➡️
        </motion.button>
      )}
    </motion.li>
  )
}
