// Tô nổi từ khoá (năm, ngày tháng, địa danh, nhân vật, sự kiện) bằng màu vàng + gạch chân gradient.
// `shown`: số ký tự đang hiện (hiệu ứng gõ chữ). Tách từ khoá trên TOÀN BỘ câu rồi mới cắt theo `shown`,
// nên từ khoá không bị nhấp nháy đổi kiểu khi đang gõ dở.
const WORDS = [
  'kênh Chợ Vải', 'sông Sài Gòn', 'đại lộ Charner', 'Charner', 'Pháp thuộc', 'Quang Trung', 'Nguyễn Huệ', 'phố đi bộ',
  'Lasan Taberd', 'Trường Taberd', 'Henri De Kerlan', 'Trần Đại Nghĩa', 'Nam Kỳ Khởi Nghĩa', 'Khởi nghĩa Nam Kỳ', 'Dinh Độc Lập',
  'Tân Sơn Nhất', 'Đảng Cộng sản Đông Dương', 'Trường Trung học Sư phạm', 'Công Lý', 'Cách Mạng 1-11', 'Mac Mahon', 'Impératrice',
  'Nguyễn Văn Cừ', 'Võ Văn Tần', 'Nguyễn Thị Minh Khai', 'Tổng khởi nghĩa Tháng Tám', 'Nam Bộ', 'Sài Gòn', 'Vĩnh Long', 'Gia Lai',
  'Hồ Chí Minh', 'Thiếu tướng', 'Anh hùng Lao động', 'Phạm Quang Lễ', 'Hoài Nhơn', 'Quy Nhơn', 'Nguyễn Nhạc', 'Nguyễn Lữ',
].sort((a, b) => b.length - a.length)
const esc = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
const RE = new RegExp(`(\\d{1,2}/\\d{1,2}/\\d{4}|\\b(?:1[5-9]|20)\\d{2}(?:[–-]\\d{2,4})?\\b|${WORDS.map(esc).join('|')})`, 'g')

const cache = new Map<string, string[]>()
export default function Highlight({ text, shown = text.length }: { text: string; shown?: number }) {
  // gõ chữ gọi lại mỗi 18ms: nhớ kết quả tách chuỗi để khỏi chạy regex lặp lại
  let parts = cache.get(text)
  if (!parts) { parts = text.split(RE); cache.set(text, parts) }
  let used = 0
  return (
    <>
      {parts.map((p, i) => {
        const piece = p.slice(0, Math.max(0, shown - used))
        used += p.length
        if (!piece) return null
        return i % 2 ? <mark key={i} className="kw">{piece}</mark> : piece
      })}
    </>
  )
}
