import { useEffect, useState } from 'react'
import gsap from 'gsap'
type P = { x: number; y: number }
export default function PaperPlane({ from, onDone }: { from: P; onDone: () => void }) {
  const [pts, setPts] = useState<P[]>([from])
  const [ang, setAng] = useState(0)
  useEffect(() => {
    const to = { x: innerWidth / 2, y: innerHeight / 2 }
    const c = { x: (from.x + to.x) / 2 + (from.x < to.x ? -160 : 160), y: Math.min(from.y, to.y) - 220 }
    const bez = (t: number): P => ({ x: (1 - t) ** 2 * from.x + 2 * (1 - t) * t * c.x + t * t * to.x, y: (1 - t) ** 2 * from.y + 2 * (1 - t) * t * c.y + t * t * to.y })
    const o = { t: 0 }
    const tw = gsap.to(o, { t: 1, duration: 2, ease: 'power1.inOut', onComplete: onDone, onUpdate: () => {
      const p = bez(o.t), q = bez(Math.min(1, o.t + 0.02))
      setAng(Math.atan2(q.y - p.y, q.x - p.x) * 180 / Math.PI)
      setPts(a => [...a.slice(-24), p])
    } })
    return () => { tw.kill() }
  }, [])
  const p = pts[pts.length - 1]
  return (
    <div className="pointer-events-none fixed inset-0 z-20">
      {pts.map((q, i) => <span key={i} className="absolute rounded-full bg-white" style={{ left: q.x, top: q.y, width: 3 + i / 3, height: 3 + i / 3, opacity: (i / pts.length) * 0.5, filter: 'blur(2px)', transform: 'translate(-50%,-50%)' }} />)}
      <svg viewBox="0 0 24 24" width="38" style={{ position: 'absolute', left: p.x, top: p.y, transform: `translate(-50%,-50%) rotate(${ang}deg)`, filter: 'drop-shadow(0 0 6px #ffcd00)' }}>
        <path d="M2 4 L22 12 L2 20 L7 12z" fill="#f5f0e1" /><path d="M7 12 L22 12" stroke="#999" strokeWidth="1" />
      </svg>
    </div>
  )
}
