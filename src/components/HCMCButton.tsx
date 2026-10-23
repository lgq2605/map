import { motion } from 'framer-motion'

// Màn bản đồ Việt Nam: nút thành phố Hồ Chí Minh — bấm vào là phóng to TP.HCM
// và hiện ra 3 con đường (Nguyễn Huệ, Nguyễn Du, Nam Kỳ Khởi Nghĩa) để chọn.
export default function HCMCButton({ onPick }: { onPick: () => void }) {
  return (
    <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
      className="absolute inset-x-3 bottom-3 z-10 md:inset-x-auto md:bottom-auto md:left-4 md:top-4 md:w-80">
      <button onClick={onPick}
        className="w-full rounded-2xl border border-gold/30 bg-navy/85 p-3 text-left backdrop-blur transition duration-200 hover:scale-105 hover:border-gold md:p-5">
        <div className="font-serif text-xl text-gold">📍 Thành phố Hồ Chí Minh</div>
        <div className="text-sm text-paper/70">Ba con đường: Nguyễn Huệ · Nguyễn Du · Nam Kỳ Khởi Nghĩa</div>
        <div className="mt-1 font-semibold text-gold md:mt-2">Khám phá ➡️</div>
      </button>
    </motion.div>
  )
}
