import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { drum } from '../audio'
import { namKy } from '../data/namKy'
import { panelCls, backCls, againCls, slide } from '../components/LocationPanel'
import Visual from '../components/Visual'
import { useReadingScroll } from '../components/useAutoScroll'
export default function NamKyScene({ onBack }: { onBack: () => void }) {
  useEffect(() => { drum() }, [])
  const box = useReadingScroll()
  return (
    <motion.aside ref={box} initial={slide()} animate={{ x: 0, y: 0 }} className={panelCls}>
      <button onClick={onBack} className={backCls}>← Chọn con đường khác</button>
      <h2 className="my-5 font-serif text-3xl font-extrabold text-vred glow">🔥 {namKy.title}</h2>
      <h3 className="font-serif text-xl text-gold">📖 Nguồn gốc tên đường</h3>
      <p className="mb-6 mt-2 leading-relaxed">{namKy.origin}</p>
      <h3 className="font-serif text-xl text-gold">❓ Khởi nghĩa Nam Kỳ là gì?</h3>
      <ul className="my-3 space-y-3 leading-relaxed">{namKy.facts.map(([k, v]) => <li key={k}><b className="text-gold">{k}:</b> {v}</li>)}</ul>
      <Visual query={namKy.query} caption={namKy.visual} />
      {/* Xem hết thông tin: nút quay lại chọn 1 trong 3 con đường */}
      <button onClick={onBack} className={againCls}>🔁 Quay lại chọn 3 con đường</button>
    </motion.aside>
  )
}
