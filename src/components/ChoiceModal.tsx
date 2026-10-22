import { useState } from 'react'
import { motion } from 'framer-motion'
type Pick = 'hue' | 'du' | 'namky'
const card = 'w-full rounded-2xl border border-gold/30 bg-navy/85 p-4 text-left backdrop-blur md:p-5 transition duration-200 hover:scale-105 hover:border-gold'
export default function ChoiceModal({ onPick }: { onPick: (p: Pick) => void }) {
  const [sub, setSub] = useState(false)
  return (
    <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="absolute inset-x-3 bottom-3 z-10 space-y-3 md:inset-x-auto md:bottom-auto md:left-4 md:top-4 md:w-80 md:space-y-4">
      {!sub ? (<>
        <button className={card} onClick={() => setSub(true)}>
          <div className="text-3xl">🏙️</div><div className="font-serif text-xl text-gold">Khu vực TP. Hồ Chí Minh</div>
          <div className="text-sm text-paper/70">Đường Nguyễn Huệ & Nguyễn Du</div><div className="mt-2 font-semibold text-gold">Khám phá ➡️</div></button>
        <button className={card} onClick={() => onPick('namky')}>
          <div className="text-3xl">🔥</div><div className="font-serif text-xl text-vred">Nam Kỳ Khởi Nghĩa</div>
          <div className="text-sm text-paper/70">Vùng Nam Bộ — 23/11/1940</div><div className="mt-2 font-semibold text-gold">Khám phá ➡️</div></button>
      </>) : (<>
        <button className={card} onClick={() => onPick('hue')}><div className="font-serif text-xl text-gold">🛣️ Đường Nguyễn Huệ</div></button>
        <button className={card} onClick={() => onPick('du')}><div className="font-serif text-xl text-gold">🏫 Đường Nguyễn Du</div></button>
        <button className="rounded-full border border-paper/30 bg-navy/85 px-4 py-2 text-sm" onClick={() => setSub(false)}>← Quay lại</button>
      </>)}
    </motion.div>
  )
}
