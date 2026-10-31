import Tooltip from './Tooltip'
import { GlobeIcon } from './Icons'

// Nút về bản đồ toàn quốc (hiện từ màn TP.HCM trở vào trong): viên thuốc nền đặc, rê chuột → địa cầu xoay 360°.
export default function BackToVietnamButton({ onClick }: { onClick: () => void }) {
  return (
    <Tooltip label="Quay về bản đồ Việt Nam" pos="below">
      <button onClick={onClick} className="glass-pill group flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-xs md:text-sm">
        <GlobeIcon className="text-gold transition-transform duration-700 group-hover:rotate-[360deg]" width={18} height={18} />
        Toàn cảnh Việt Nam
      </button>
    </Tooltip>
  )
}
