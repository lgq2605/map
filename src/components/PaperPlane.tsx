import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
type P = { x: number; y: number }
type Spark = { x: number; y: number; vx: number; vy: number; life: number; r: number }

// Máy bay giấy bay theo đường cong Bézier rồi "lao vào" địa cầu: nhỏ dần, mờ dần và biến mất đúng tại Việt Nam.
// Vẽ: SVG gấp giấy 3 tầng sáng–tối, vệt trail phát sáng (đoạn nối mờ dần) và vài hạt sáng rơi dọc đường bay.
// (Máy bay là lớp phủ DOM chứ không nằm trong cảnh THREE nên trail dùng SVG thay cho THREE.Line.)
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
      setPts(a => [...a.slice(-28), p])
      setT(o.t)
      // hạt sáng: sinh ra sau đuôi máy bay, rơi dần theo trọng lực
      if (o.t < 0.92) sp.current.push({ x: p.x + (Math.random() - 0.5) * 8, y: p.y + (Math.random() - 0.5) * 8, vx: (Math.random() - 0.5) * 0.6, vy: 0.2 + Math.random() * 0.4, life: 1, r: 1 + Math.random() * 1.8 })
      sp.current = sp.current.map(s => ({ ...s, x: s.x + s.vx, y: s.y + s.vy, vy: s.vy + 0.07, life: s.life - 0.022 })).filter(s => s.life > 0).slice(-36)
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
        <defs><filter id="trail-glow" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3" /></filter></defs>
        {/* trail: quầng sáng mờ phía dưới + lõi sáng mảnh phía trên, độ mờ tăng dần về phía máy bay */}
        <g filter="url(#trail-glow)">
          {pts.slice(1).map((q, i) => <line key={i} x1={pts[i].x} y1={pts[i].y} x2={q.x} y2={q.y} stroke="#ffcd00" strokeLinecap="round" strokeWidth={2 + (i / pts.length) * 8} opacity={(i / pts.length) * 0.8} />)}
        </g>
        {pts.slice(1).map((q, i) => <line key={i} x1={pts[i].x} y1={pts[i].y} x2={q.x} y2={q.y} stroke="#fff6d6" strokeLinecap="round" strokeWidth={1 + (i / pts.length) * 2.5} opacity={(i / pts.length) * 0.95} />)}
        {sparks.map((s, i) => <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#ffe58a" opacity={s.life} style={{ filter: 'drop-shadow(0 0 4px #ffcd00)' }} />)}
      </svg>
      <svg viewBox="0 0 48 24" width="46" style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) rotate(${ang}deg) scale(${scale})`, filter: 'drop-shadow(0 0 7px #ffcd00)' }}>
        {/* giấy gấp 3 tầng: cánh trên sáng · sống giữa trung tính · cánh dưới tối */}
        <polygon points="2,3 46,12 14,12" fill="#fffaf0" />
        <polygon points="14,12 46,12 8,17" fill="#cfc2a0" />
        <polygon points="2,21 46,12 8,17" fill="#8f8466" />
        <path d="M14 12 L46 12 M8 17 L46 12" stroke="rgba(60,50,30,.55)" strokeWidth=".7" />
      </svg>
    </div>
  )
}
