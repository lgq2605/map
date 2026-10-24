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
