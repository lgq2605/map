import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
type P = { x: number; y: number }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; r: number }

// Máy bay giấy bay theo đường cong Bézier rồi "lao vào" địa cầu: nhỏ dần, mờ dần và biến mất đúng tại Việt Nam.
// Vẽ: SVG máy bay giấy cổ điển (cánh sáng/tối + sống gấp + ky), vệt trail mờ dần (đoạn nối) và vài hạt nhỏ rơi dọc đường bay. Không blur/glow cho nhẹ.
export default function PaperPlane({ from, onNear, onLand }: { from: P; onNear: () => void; onLand?: () => void }) {
  const [pts, setPts] = useState<P[]>([from])
  const [ang, setAng] = useState(0)
  const [t, setT] = useState(0)
  const [sparks, setSparks] = useState<Spark[]>([])
  const sp = useRef<Spark[]>([])
  useEffect(() => {
    const to = { x: innerWidth / 2, y: innerHeight / 2 }
    const c = { x: (from.x + to.x) / 2 + (from.x < to.x ? -160 : 160), y: Math.min(from.y, to.y) - 220 }
    const bez = (k: number): P => ({ x: (1 - k) ** 2 * from.x + 2 * (1 - k) * k * c.x + k * k * to.x, y: (1 - k) ** 2 * from.y + 2 * (1 - k) * k * c.y + k * k * to.y })
    const o = { t: 0 }
    let near = false
    const tw = gsap.to(o, { t: 1, duration: 2.2, ease: 'power1.inOut', onUpdate: () => {
      const p = bez(o.t), q = bez(Math.min(1, o.t + 0.02))
      setAng(Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI)
      setPts(a => [...a.slice(-20), p])
      setT(o.t)
      if (o.t < 0.92 && Math.random() < 0.5) sp.current.push({ x: p.x + (Math.random() - 0.5) * 8, y: p.y + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 0.6, vy: 0.2 + Math.random() * 0.4, life: 1, r: 1 + Math.random() * 1.5 })
      sp.current = sp.current.map(s => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, vy: s.vy + 0.07, life: s.life - 0.025 })).filter(s => s.life > 0).slice(-20)
      setSparks(sp.current)
      if (!near && o.t > 0.7) { near = true; onNear() } // bắt đầu zoom khi máy bay sắp chạm đích
    }, onComplete: () => onLand?.() })
    return () => { tw.kill() }
  }, [])
  if (t >= 1) return null
  const p = pts[pts.length - 1]
  const scale = 1 - 0.9 * t ** 1.6
  const opacity = t > 0.85 ? (1 - t) / 0.15 : 1
  return (
    <div className="pointer-events-none fixed inset-0 z-20" style={{ opacity }} aria-hidden="true">
      <svg className="absolute inset-0" width="100%" height="100%" style={{ overflow: 'visible' }}>
        {pts.slice(1).map((q, i) => <line key={i} x1={pts[i].x} y1={pts[i].y} x2={q.x} y2={q.y} stroke="#f5f0e1" strokeLinecap="round" strokeWidth={1 + (i / pts.length) * 3} opacity={(i / pts.length) * 0.7} />)}
        {sparks.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#f5f0e1" opacity={s.life * 0.8} />)}
      </svg>
      <svg viewBox="0 0 64 40" width="56" style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) rotate(${ang}deg) scale(${scale})` }}>
        {/* máy bay giấy cổ điển (nhìn chếch từ trên): mũi nhọn bên phải, hai cánh xếp thành chữ V quanh sống gấp,
            "ky" gấp tối màu lòi ra bên dưới — vẽ từ trong ra ngoài: ky → cánh xa (sáng) → cánh gần (vừa) */}
        <polygon points="63,20 27,21 22,38" fill="#8d9bb0" />
        <polygon points="3,3 63,20 27,21" fill="#ffffff" />
        <polygon points="27,21 63,20 7,33" fill="#d9e2ee" />
        <path d="M3 3 L63 20 L7 33 L27 21 Z" fill="none" stroke="rgba(40,55,80,.45)" strokeWidth=".8" strokeLinejoin="round" />
        <path d="M27 21 L63 20 M63 20 L22 38 M27 21 L22 38 M3 3 L41 19.4 M7 33 L45 20.5" stroke="rgba(40,55,80,.4)" strokeWidth=".7" strokeLinecap="round" />
      </svg>
    </div>
  )
}
