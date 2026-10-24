import { useEffect } from 'react'
// Gợn sóng vàng nhỏ (0.4s) lan ra từ điểm bấm. Tạo thẳng phần tử DOM rồi xoá — không làm React render lại.
export default function ClickRipple() {
  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const down = (e: PointerEvent) => {
      const r = document.createElement('span')
      r.className = 'ripple'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'
      document.body.appendChild(r)
      setTimeout(() => r.remove(), 450)
    }
    addEventListener('pointerdown', down, { passive: true })
    return () => removeEventListener('pointerdown', down)
  }, [])
  return null
}
