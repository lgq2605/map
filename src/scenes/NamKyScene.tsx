import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { drum } from '../audio'
import { namKy } from '../data/namKy'
import { panelCls, backCls, againCls, slide } from '../components/LocationPanel'
import Visual from '../components/Visual'
import { useFollowScroll } from '../components/useAutoScroll'

const nextCls = 'min-h-11 rounded-full bg-gold px-4 py-2 font-semibold text-navy transition duration-200 hover:scale-105'
const bob = { animate: { x: [0, 8, 0] }, transition: { repeat: Infinity, duration: 1 } }

// Lịch sử con đường chia thành 3 phần xem LẦN LƯỢT bằng nút "Tiếp theo":
// 1) Nguồn gốc tên đường → 2) Khởi nghĩa Nam Kỳ là gì? →
// 3) Khi nào con đường được đặt tên (kèm ảnh sự kiện) + nút Quay lại.
// Trên bản đồ: đường Nam Kỳ Khởi Nghĩa luôn được tô sáng xanh dương (40%, không glow)
// trải dọc suốt chiều dài con đường (xem highlight() trong VietnamMapScene.tsx).
export default function NamKyScene({ onBack }: { onBack: () => void }) {
  useEffect(() => { drum() }, [])
  const [step, setStep] = useState(0)
  const { box, inner } = useFollowScroll(step)
  return (
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0 }} className={panelCls}>
      <div ref={inner}>
        <button onClick={onBack} className={backCls}>← Chọn con đường khác</button>
        <h2 className="my-5 font-serif text-3xl font-extrabold text-vred">🔥 {namKy.title}</h2>

        <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-3">
          <h3 className="font-serif text-xl text-gold">📖 Nguồn gốc tên đường</h3>
          <p className="leading-relaxed">{namKy.origin}</p>
          {step === 0 && <motion.button {...bob} onClick={() => setStep(1)} className={nextCls}>Tiếp theo ➡️</motion.button>}
        </motion.section>

        {step >= 1 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mt-8 space-y-3">
            <h3 className="font-serif text-xl text-gold">❓ Khởi nghĩa Nam Kỳ là gì?</h3>
            <ul className="space-y-3 leading-relaxed">{namKy.facts.map(([k, v]) => <li key={k}><b className="text-gold">{k}:</b> {v}</li>)}</ul>
            {step === 1 && <motion.button {...bob} onClick={() => setStep(2)} className={nextCls}>Tiếp theo ➡️</motion.button>}
          </motion.section>
        )}

        {step >= 2 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mt-8 space-y-3">
            <h3 className="font-serif text-xl text-gold">🕰️ {namKy.naming.heading}</h3>
            <p className="leading-relaxed">{namKy.naming.text}</p>
            <Visual src={namKy.naming.image} caption={namKy.naming.caption} />
            <button onClick={onBack} className={againCls}>Quay lại</button>
          </motion.section>
        )}
      </div>
    </motion.aside>
  )
}
