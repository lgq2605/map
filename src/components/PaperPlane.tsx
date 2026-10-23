import { useEffect, useState } from 'react'
import gsap from 'gsap'
type P = { x: number; y: number }

// Máy bay bay theo đường cong Bézier rồi "lao vào" địa cầu: nhỏ dần, mờ dần và biến mất đúng tại Việt Nam.
export default function PaperPlane({ from, onNear }: { from: P; onNear: () => void }) {
  const [pts, setPts] = useState<P[]>([from])
  const [ang, setAng] = useState(0)
  const [t, setT] = useState(0)
  useEffect(() => {
    const to = { x: innerWidth / 2, y: innerHeight / 2 }
    const c = { x: (from.x + to.x) / 2 + (from.x < to.x ? -160 : 160), y: Math.min(from.y, to.y) - 220 }
    const bez = (k: number): P => ({ x: (1 - k) ** 2 * from.x + 2 * (1 - k) * k * c.x + k * k * to.x, y: (1 - k) ** 2 * from.y + 2 * (1 - k) * k * c.y + k * k * to.y })
    const o = { t: 0 }
    let near = false
    const tw = gsap.to(o, { t: 1, duration: 2.2, ease: 'power1.inOut', onUpdate: () => {
      const p = bez(o.t), q = bez(Math.min(1, o.t + 0.02))
      setAng(Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI)
      setPts(a => [...a.slice(-24), p])
      setT(o.t)
      if (!near && o.t > 0.7) { near = true; onNear() } // bắt đầu zoom khi máy bay sắp chạm đích
    } })
    return () => { tw.kill() }
  }, [])
  if (t >= 1) return null
  const p = pts[pts.length - 1]
  const scale = 1 - 0.9 * t ** 1.6
  const opacity = t > 0.85 ? (1 - t) / 0.15 : 1
  return (
    <div className="pointer-events-none fixed inset-0 z-20" style={{ opacity }}>
      {pts.map((q, i) => <span key={i} className="absolute rounded-full bg-white" style={{ left: q.x, top: q.y, width: 3 + i / 3, height: 3 + i / 3, opacity: (i / pts.length) * 0.5, filter: 'blur(2px)', transform: 'translate(-50%,-50%)' }} />)}
      <svg viewBox="0 0 24 24" width="38" style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) rotate(${ang}deg) scale(${scale})`, filter: 'drop-shadow(0 0 6px #ffcd00)' }}>
        <path d="M2 4 L22 12 L2 20 L7 12z" fill="#f5f0e1" /><path d="M7 12 L22 12" stroke="#999" strokeWidth="1" />
      </svg>
    </div>
  )
}
