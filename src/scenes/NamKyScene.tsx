import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { drum } from '../audio'
import { namKy } from '../data/namKy'
import { panelCls, backCls, againCls, slide } from '../components/LocationPanel'
import Visual from '../components/Visual'
import { useTypewriter } from '../components/useTypewriter'
import { useFollowScroll } from '../components/useAutoScroll'

const nextCls = 'min-h-11 rounded-full bg-gold px-4 py-2 font-semibold text-navy transition duration-200 hover:scale-105'
const bob = { animate: { x: [0, 8, 0] }, transition: { repeat: Infinity, duration: 1 } }

// Chữ hiện TỪNG TỪ như các con đường khác (xem TimelineStep): mỗi khối nội dung gõ dần,
// gõ xong mới hiện nút "Tiếp theo". Khối chữ càng dài càng gõ nhanh để không phải chờ quá ~2,5 giây.
const typedSpeed = (text: string) => Math.min(18, Math.max(4, Math.round(2500 / Math.max(1, text.length))))

function Typed({ text, onDone, className }: { text: string; onDone?: () => void; className?: string }) {
  const { text: shown, done } = useTypewriter(text, true, typedSpeed(text))
  useEffect(() => { if (done) onDone?.() }, [done]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={className}>{shown}</span>
}

// Lịch sử con đường chia thành 3 phần xem LẦN LƯỢT bằng nút "Tiếp theo":
// 1) Nguồn gốc tên đường → 2) Khởi nghĩa Nam Kỳ là gì? →
// 3) Khi nào con đường được đặt tên (kèm ảnh sự kiện) + nút Quay lại.
// Trên bản đồ: đường Nam Kỳ Khởi Nghĩa luôn được tô sáng xanh dương (40%, không glow)
// trải dọc suốt chiều dài con đường (xem highlight() trong VietnamMapScene.tsx).
export default function NamKyScene({ onBack }: { onBack: () => void }) {
  useEffect(() => { drum() }, [])
  const [step, setStep] = useState(0)
  const { box, inner } = useFollowScroll(step)
  // Nút của từng phần chỉ hiện sau khi khối chữ tương ứng gõ xong (như TimelineStep)
  const [done0, setDone0] = useState(false)
  const [typedFacts, setTypedFacts] = useState(0)
  const done1 = typedFacts >= namKy.facts.length
  const [done2, setDone2] = useState(false)
  return (
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0 }} className={panelCls}>
      <div ref={inner}>
        <button onClick={onBack} className={backCls}>← Chọn con đường khác</button>
        <h2 className="my-5 font-serif text-3xl font-extrabold text-vred">🔥 {namKy.title}</h2>

        <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="space-y-3">
          <h3 className="font-serif text-xl text-gold">📖 Nguồn gốc tên đường</h3>
          <p className="leading-relaxed"><Typed text={namKy.origin} onDone={() => setDone0(true)} /></p>
          {step === 0 && done0 && <motion.button {...bob} onClick={() => setStep(1)} className={nextCls}>Tiếp theo ➡️</motion.button>}
        </motion.section>

        {step >= 1 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mt-8 space-y-3">
            <h3 className="font-serif text-xl text-gold">❓ Khởi nghĩa Nam Kỳ là gì?</h3>
            <ul className="space-y-3 leading-relaxed">
              {namKy.facts.map(([k, v]) => (
                <li key={k}><b className="text-gold">{k}:</b> <Typed text={v} onDone={() => setTypedFacts(n => n + 1)} /></li>
              ))}
            </ul>
            {step === 1 && done1 && <motion.button {...bob} onClick={() => setStep(2)} className={nextCls}>Tiếp theo ➡️</motion.button>}
          </motion.section>
        )}

        {step >= 2 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className="mt-8 space-y-3">
            <h3 className="font-serif text-xl text-gold">🕰️ {namKy.naming.heading}</h3>
            <p className="leading-relaxed"><Typed text={namKy.naming.text} onDone={() => setDone2(true)} /></p>
            <Visual src={namKy.naming.image} caption={namKy.naming.caption} />
            {done2 && <button onClick={onBack} className={againCls}>Quay lại</button>}
          </motion.section>
        )}
      </div>
    </motion.aside>
  )
}
