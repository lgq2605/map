import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

// Con trỏ: chấm vàng nhỏ + vòng tròn mờ đi theo (lò xo). Chỉ trên máy có chuột; tắt khi giảm chuyển động.
export default function CustomCursor() {
  const [on, setOn] = useState(false)
  const [hover, setHover] = useState(false)
  const [visible, setVisible] = useState(false)
  const x = useMotionValue(-100), y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.6 }), ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.6 })
  useEffect(() => {
    if (!matchMedia('(hover: hover) and (pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    setOn(true)
    document.documentElement.classList.add('custom-cursor')
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setVisible(true) }
    const over = (e: MouseEvent) => setHover(!!(e.target as Element | null)?.closest?.('a,button,[role="button"],input,.leaflet-marker-icon'))
    const leave = () => setVisible(false)
    addEventListener('pointermove', move, { passive: true }); addEventListener('mouseover', over); document.documentElement.addEventListener('mouseleave', leave)
    return () => { document.documentElement.classList.remove('custom-cursor'); removeEventListener('pointermove', move); removeEventListener('mouseover', over); document.documentElement.removeEventListener('mouseleave', leave) }
  }, [])
  if (!on) return null
  return (
    <>
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9999] h-9 w-9 rounded-full border border-gold/70" style={{ x: rx, y: ry, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0, background: hover ? 'rgba(255,205,0,.12)' : 'transparent' }} animate={{ scale: hover ? 1.6 : 1 }} transition={{ scale: { duration: 0.2 } }} />
      <motion.div aria-hidden="true" className="pointer-events-none fixed left-0 top-0 z-[9999] h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_#ffcd00]" style={{ x, y, translateX: '-50%', translateY: '-50%', opacity: visible ? 1 : 0 }} />
    </>
  )
}
