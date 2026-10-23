// Nút về bản đồ toàn quốc (hiện từ màn TP.HCM trở vào trong) —
// kiểu dáng khiêm tốn, mờ nhạt để không nổi bật hơn nội dung chính.
export default function BackToVietnamButton({ onClick }: { onClick: () => void }) {
  return <button onClick={onClick} className="rounded-full border border-paper/20 bg-navy/50 px-3.5 py-2 text-xs text-paper/70 backdrop-blur transition duration-200 hover:border-paper/40 hover:text-paper md:text-sm">🌏 Toàn cảnh Việt Nam</button>
}
