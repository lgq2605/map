import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { drum } from '../audio'
import { namKy } from '../data/namKy'
import { panelCls, backCls, againCls, slide } from '../components/LocationPanel'
import Visual from '../components/Visual'
import Highlight from '../components/Highlight'
import NextButton from '../components/NextButton'
import { useTypewriter } from '../components/useTypewriter'
import { useFollowScroll } from '../components/useAutoScroll'

// Khung mỗi phần nội dung + hiệu ứng chữ hiện khi cuộn tới (whileInView)
const card = 'relative space-y-3 overflow-hidden rounded-xl border border-gold/20 bg-white/[0.04] p-4'
const reveal = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.6 } }

// Chữ hiện từng chữ với ĐÚNG tốc độ của 2 con đường kia (xem TimelineStep: useTypewriter, mặc định 18ms/chữ).
// Mỗi khối nội dung gõ dần, gõ xong mới hiện khối kế tiếp / nút "Tiếp theo".

function Typed({ text, onDone, className }: { text: string; onDone?: () => void; className?: string }) {
  const { text: shown, done } = useTypewriter(text, true)
  useEffect(() => { if (done) onDone?.() }, [done]) // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={className}><Highlight text={text} shown={shown.length} /></span>
}

// Lịch sử con đường chia thành 3 phần xem LẦN LƯỢT bằng nút "Tiếp theo":
// 1) Nguồn gốc tên đường → 2) Khởi nghĩa Nam Kỳ là gì? →
// 3) Khi nào con đường được đặt tên (kèm ảnh sự kiện) + nút Quay lại.
// Trên bản đồ: khi đã chọn đường Nam Kỳ Khởi Nghĩa thì nó được tô xanh dương (40%, không glow)
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
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 120, damping: 22 }} className={panelCls}>
      <div ref={inner}>
        <button onClick={onBack} className={backCls}>← Chọn con đường khác</button>
        <h2 className="my-5 font-serif text-3xl font-extrabold leading-tight tracking-[0.02em]"><span>🔥</span> <span className="red-gold-text">{namKy.title}</span></h2>

        <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={card}>
          <h3 className="font-sub text-2xl font-bold tracking-[0.02em] text-gold">📖 Nguồn gốc tên đường</h3>
          <motion.p {...reveal} className="leading-[1.7]"><Typed text={namKy.origin} onDone={() => setDone0(true)} /></motion.p>
          {step === 0 && done0 && <NextButton label="Tiếp theo" onClick={() => setStep(1)} />}
        </motion.section>

        {step >= 1 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={card + ' mt-8'}>
            <h3 className="font-sub text-2xl font-bold tracking-[0.02em] text-gold">❓ Khởi nghĩa Nam Kỳ là gì?</h3>
            <ul className="space-y-3 leading-[1.7]">
              {/* Các ý hiện LẦN LƯỢT: ý sau chỉ xuất hiện khi ý trước đã gõ xong (trước đây tất cả gõ cùng lúc) */}
              {namKy.facts.slice(0, typedFacts + 1).map(([k, v]) => (
                <motion.li key={k} {...reveal}><b className="text-gold">{k}:</b> <Typed text={v} onDone={() => setTypedFacts(n => n + 1)} /></motion.li>
              ))}
            </ul>
            {step === 1 && done1 && <NextButton label="Tiếp theo" onClick={() => setStep(2)} />}
          </motion.section>
        )}

        {step >= 2 && (
          <motion.section initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }} className={card + ' mt-8'}>
            <h3 className="font-sub text-2xl font-bold tracking-[0.02em] text-gold">🕰️ {namKy.naming.heading}</h3>
            <motion.p {...reveal} className="leading-[1.7]"><Typed text={namKy.naming.text} onDone={() => setDone2(true)} /></motion.p>
            <Visual src={namKy.naming.image} caption={namKy.naming.caption} />
            {done2 && <button onClick={onBack} className={againCls}>Quay lại</button>}
          </motion.section>
        )}
      </div>
    </motion.aside>
  )
}
