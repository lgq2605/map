import { useEffect, useRef } from 'react'

// Nền sao lấp lánh (canvas). ≤ 80 sao trên máy tính, 20 sao trên điện thoại. KHÔNG có bụi vàng.
// Parallax: sao dịch chuyển bằng 50% quãng cuộn của bảng nội dung + hơi lệch theo chuột (theo độ sâu từng sao).
// Giảm chuyển động: vẽ tĩnh một lần.
export default function StarField() {
  const cv = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = cv.current!, g = c.getContext('2d')
    if (!g) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const N = innerWidth < 768 ? 20 : 80
    const stars = Array.from({ length: N }, () => ({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random() * 0.7, r: 0.4 + Math.random() * 1.2, ph: Math.random() * 6.28, sp: 0.6 + Math.random() * 1.6 }))
    let w = 0, h = 0, dpr = 1, scroll = 0, mx = 0, my = 0, raf = 0
    const size = () => { dpr = Math.min(2, devicePixelRatio || 1); w = innerWidth; h = innerHeight; c.width = w * dpr; c.height = h * dpr; c.style.width = w + 'px'; c.style.height = h + 'px'; g.setTransform(dpr, 0, 0, dpr, 0, 0) }
    const draw = (t: number) => {
      g.clearRect(0, 0, w, h)
      for (const s of stars) {
        const tw = reduce ? 0.8 : 0.45 + 0.55 * Math.sin(t / 1000 * s.sp + s.ph)
        const x = ((s.x * w + mx * 18 * s.z) % w + w) % w
        const y = (((s.y * h - scroll * 0.5 * s.z + my * 12 * s.z) % h) + h) % h
        g.globalAlpha = 0.25 + 0.75 * tw * s.z
        g.fillStyle = s.r > 1.1 ? '#fff6d6' : '#dfe8ff'
        g.beginPath(); g.arc(x, y, s.r, 0, 6.2832); g.fill()
      }
      g.globalAlpha = 1
      if (!reduce) raf = requestAnimationFrame(draw)
    }
    size(); draw(0)
    // Cuộn của bất kỳ bảng nào trong trang (sự kiện scroll không nổi bọt nên bắt ở pha capture)
    const last = new WeakMap<EventTarget, number>()
    const onScroll = (e: Event) => {
      const el = e.target as HTMLElement
      if (!(el instanceof HTMLElement)) return
      const d = el.scrollTop - (last.get(el) ?? 0); last.set(el, el.scrollTop); scroll += d
      if (reduce) draw(0)
    }
    const onMove = (e: PointerEvent) => { mx = e.clientX / w - 0.5; my = e.clientY / h - 0.5; if (reduce) draw(0) }
    addEventListener('resize', size); addEventListener('scroll', onScroll, true); addEventListener('pointermove', onMove, { passive: true })
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size); removeEventListener('scroll', onScroll, true); removeEventListener('pointermove', onMove) }
  }, [])
  return <canvas ref={cv} aria-hidden="true" className="pointer-events-none fixed left-0 top-0" style={{ zIndex: -1 }} />
}
