import { motion } from 'framer-motion'
import { ArrowDown } from './Icons'

// Nút "Tiếp theo" / "Xem nhân vật": nút tròn viền gradient quay, mũi tên nảy nhẹ, chữ mờ dần khi không rê chuột.
export default function NextButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <motion.button onClick={onClick} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
      className="no-fx group flex min-h-14 items-center gap-3 rounded-full pr-3 text-left transition-[filter] duration-200 hover:brightness-110">
      <span className="relative grid h-14 w-14 flex-none place-items-center rounded-full transition-transform duration-200 group-hover:scale-105">
        <span className="ring-spin absolute inset-0 rounded-full" />
        <span className="absolute inset-[2.5px] rounded-full bg-navy" />
        <motion.span animate={{ y: [-4, 0, -4] }} transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }} className="relative text-gold"><ArrowDown width={22} height={22} /></motion.span>
      </span>
      <span className="text-sm font-semibold uppercase tracking-[0.18em] text-gold/70 transition duration-200 group-hover:text-gold">{label}</span>
    </motion.button>
  )
}
