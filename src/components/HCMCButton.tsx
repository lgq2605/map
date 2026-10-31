import { motion } from 'framer-motion'
import TiltCard from './TiltCard'
import { ArrowRight, PinIcon } from './Icons'

// Màn bản đồ Việt Nam: nút thành phố Hồ Chí Minh — bấm vào là phóng to TP.HCM
// và hiện ra 3 địa điểm (đường Nguyễn Huệ, trường Trần Đại Nghĩa, đường Nam Kỳ Khởi Nghĩa) để chọn.
export default function HCMCButton({ onPick }: { onPick: () => void }) {
  return (
    <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="absolute inset-x-3 bottom-3 z-10 md:inset-x-auto md:bottom-auto md:left-4 md:top-4 md:w-80">
      <TiltCard>
        <button onClick={onPick} className="no-fx glass-card group relative block w-full overflow-hidden p-3 text-left md:p-5">
          <PinIcon aria-hidden="true" className="pointer-events-none absolute right-3 top-3 text-gold/40" width={44} height={44} />
          <div className="font-serif text-xl font-bold tracking-[0.02em] text-gold">📍 Thành phố Hồ Chí Minh</div>
          <div className="text-sm text-paper/75">Ba địa điểm: Nguyễn Huệ · Trường Trần Đại Nghĩa · Nam Kỳ Khởi Nghĩa</div>
          <div className="explore mt-2">Khám phá <ArrowRight width={16} height={16} /></div>
        </button>
      </TiltCard>
    </motion.div>
  )
}
