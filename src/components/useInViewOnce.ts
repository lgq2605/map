import { useEffect, useState, type RefObject } from 'react'
// Trả về true (và giữ nguyên) khi phần tử lần đầu lọt vào khung nhìn — dùng để tải ảnh lười và đếm số.
// Trình duyệt không có IntersectionObserver thì coi như đã thấy.
export function useInViewOnce(ref: RefObject<Element | null>, margin = '0px') {
  const [seen, setSeen] = useState(typeof IntersectionObserver === 'undefined')
  useEffect(() => {
    const el = ref.current
    if (seen || !el) return
    const io = new IntersectionObserver(es => { if (es.some(e => e.isIntersecting)) { setSeen(true); io.disconnect() } }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [seen, margin])
  return seen
}
