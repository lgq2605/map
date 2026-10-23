import { useEffect, useRef } from 'react'
import { useFxBudget } from './useFxBudget'

// Hạt sáng vàng/trắng bay lơ lửng rất chậm (canvas 2D, ≤ 50 hạt desktop / 20 hạt mobile).
// - Mỗi hạt dùng sprite vẽ sẵn (không dùng shadowBlur) → rất nhẹ.
// - Parallax: khi một khung bất kỳ trong trang cuộn, hạt trôi ngược chiều với tốc độ ~50% quãng cuộn.
// - prefers-reduced-motion: chỉ vẽ 1 khung tĩnh, không chạy vòng lặp. Tab ẩn thì tạm dừng.
type P = { x: number; y: number; r: number; vx: number; vy: number; a: number; ph: number; sp: number; z: number; s: number }
const COLORS = ['255,205,0', '255,184,0', '245,240,225']

function sprite(rgb: string) {
  const c = document.createElement('canvas'); c.width = c.height = 32
  const g = c.getContext('2d')
  if (!g) return c
  const gr = g.createRadialGradient(16, 16, 0, 16, 16, 16)
  gr.addColorStop(0, `rgba(${rgb},1)`); gr.addColorStop(0.25, `rgba(${rgb},0.55)`); gr.addColorStop(1, `rgba(${rgb},0)`)
  g.fillStyle = gr; g.fillRect(0, 0, 32, 32)
  return c
}

export default function ParticleBackground() {
  const ref = useRef<HTMLCanvasElement>(null)
  const { reduced, dust } = useFxBudget()

  useEffect(() => {
    const cv = ref.current, host = cv?.parentElement
    const ctx = cv?.getContext('2d')
    if (!cv || !host || !ctx) return
    const dpr = Math.min(devicePixelRatio || 1, 1.5)
    let w = 1, h = 1, raf = 0, last = 0, off = 0, offDraw = 0
    const sprites = COLORS.map(sprite)
    const ps: P[] = Array.from({ length: dust }, () => ({
      x: Math.random(), y: Math.random(), r: 1.2 + Math.random() * 2.4,
      vx: (Math.random() - 0.5) * 6, vy: -(2 + Math.random() * 7), // px/giây: rất chậm, hơi trôi lên
      a: 0.25 + Math.random() * 0.55, ph: Math.random() * 6.28, sp: 0.4 + Math.random() * 0.9,
      z: 0.7 + Math.random() * 0.6, s: Math.floor(Math.random() * COLORS.length),
    }))
    const mod = (v: number, m: number) => ((v % m) + m) % m
    const resize = () => {
      w = Math.max(1, host.clientWidth); h = Math.max(1, host.clientHeight)
      cv.width = Math.round(w * dpr); cv.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) draw(0)
    }
    const draw = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      for (const p of ps) {
        const y = mod(p.y * h - offDraw * 0.5 * p.z, h)
        const al = reduced ? p.a * 0.7 : p.a * (0.55 + 0.45 * Math.sin(t / 1000 * p.sp + p.ph))
        ctx.globalAlpha = al
        const d = p.r * 5
        ctx.drawImage(sprites[p.s], p.x * w - d / 2, y - d / 2, d, d)
      }
      ctx.globalAlpha = 1
    }
    const tick = (t: number) => {
      const dt = Math.min(0.05, last ? (t - last) / 1000 : 0); last = t
      offDraw += (off - offDraw) * 0.1
      for (const p of ps) {
        p.x = mod(p.x + (p.vx * dt) / w, 1)
        p.y = mod(p.y + (p.vy * dt) / h, 1)
      }
      draw(t)
      raf = requestAnimationFrame(tick)
    }

    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null
    ro?.observe(host)
    addEventListener('resize', resize)
    resize()

    // Parallax: bắt scroll của MỌI phần tử cuộn (bảng thông tin, trang) bằng capture
    const seen = new WeakMap<EventTarget, number>()
    const onScroll = (e: Event) => {
      const el = e.target instanceof Element ? e.target : document.scrollingElement
      if (!el) return
      const st = el.scrollTop, prev = seen.get(el) ?? st
      seen.set(el, st); off += st - prev
    }
    const onVis = () => {
      cancelAnimationFrame(raf); last = 0
      if (!document.hidden && !reduced) raf = requestAnimationFrame(tick)
    }
    if (!reduced) {
      document.addEventListener('scroll', onScroll, { capture: true, passive: true })
      document.addEventListener('visibilitychange', onVis)
      raf = requestAnimationFrame(tick)
    }
    return () => {
      cancelAnimationFrame(raf); ro?.disconnect(); removeEventListener('resize', resize)
      document.removeEventListener('scroll', onScroll, { capture: true } as EventListenerOptions)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [dust, reduced])

  return <canvas ref={ref} aria-hidden="true" className="fx-particles" />
}
