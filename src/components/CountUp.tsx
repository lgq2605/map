import { useEffect, useRef, useState } from 'react'
import { useInViewOnce } from './useInViewOnce'

// Đếm từ 0 tới số thật khi vào khung nhìn (tắt khi người dùng bật "giảm chuyển động").
export default function CountUp({ to, duration = 1300, pad = 0, className }: { to: number; duration?: number; pad?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const seen = useInViewOnce(ref)
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!seen) return
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { setV(to); return }
    let raf = 0, t0 = 0
    const tick = (t: number) => {
      t0 ||= t
      const k = Math.min(1, (t - t0) / duration)
      setV(Math.round(to * (1 - (1 - k) ** 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [seen, to, duration])
  return <span ref={ref} className={className} aria-hidden="true">{String(v).padStart(pad, '0')}</span>
}
