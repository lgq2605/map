import { useEffect, useRef } from 'react'

// Người dùng tự lăn/kéo thì ngừng tự cuộn để không giành quyền điều khiển
function onUserScroll(el: HTMLElement, stop: () => void) {
  const evs = ['wheel', 'touchstart', 'pointerdown', 'keydown'] as const
  evs.forEach(e => el.addEventListener(e, stop, { passive: true }))
  return () => evs.forEach(e => el.removeEventListener(e, stop))
}

// Bảng nhiều bước (Nguyễn Huệ, Nguyễn Du): tự cuộn xuống cuối mỗi khi có nội dung mới —
// bước mới hiện ra, chữ gõ dần làm dài thêm, ảnh tải xong, nút "Tiếp theo" xuất hiện.
// (Trước đây chỉ cuộn 1 lần lúc bấm nút, khi chữ chưa gõ nên không tới được cuối.)
export function useFollowScroll(step: number) {
  const box = useRef<HTMLElement>(null)
  const inner = useRef<HTMLDivElement>(null)
  const follow = useRef(true)
  const toEnd = () => { const b = box.current; if (b && follow.current) b.scrollTo({ top: b.scrollHeight, behavior: 'smooth' }) }
  useEffect(() => { follow.current = true; toEnd() }, [step])
  useEffect(() => {
    const b = box.current, c = inner.current
    if (!b || !c) return
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(toEnd) : null
    ro?.observe(c)
    const off = onUserScroll(b, () => { follow.current = false })
    return () => { ro?.disconnect(); off() }
  }, [])
  return { box, inner }
}

// Bảng một trang (Nam Kỳ Khởi Nghĩa): sau khi mở, tự cuộn xuống chậm như tốc độ đọc.
// Chạm/lăn chuột là dừng. Màn hình rộng đã thấy hết nội dung thì không cuộn.
export function useReadingScroll(pxPerSec = 28, delayMs = 2500) {
  const box = useRef<HTMLElement>(null)
  useEffect(() => {
    const b = box.current
    if (!b) return
    let on = true, raf = 0, last = 0, y = 0
    const tick = (t: number) => {
      if (!on) return
      const max = b.scrollHeight - b.clientHeight
      y = Math.min(max, y + pxPerSec * (last ? (t - last) / 1000 : 0))
      last = t
      b.scrollTop = y
      if (y < max - 1) raf = requestAnimationFrame(tick)
    }
    const timer = setTimeout(() => { y = b.scrollTop; raf = requestAnimationFrame(tick) }, delayMs)
    const off = onUserScroll(b, () => { on = false })
    return () => { on = false; clearTimeout(timer); cancelAnimationFrame(raf); off() }
  }, [])
  return box
}
