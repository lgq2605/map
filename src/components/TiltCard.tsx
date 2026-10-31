import { type ReactNode, type PointerEvent } from 'react'
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion'

// Thẻ nghiêng 3D theo con trỏ (tối đa `max` độ). Cảm ứng / giảm chuyển động thì đứng yên.
export default function TiltCard({ children, className = '', max = 8 }: { children: ReactNode; className?: string; max?: number }) {
  const reduce = useReducedMotion()
  const px = useMotionValue(0), py = useMotionValue(0)
  const rotateX = useSpring(useTransform(py, [-0.5, 0.5], [max, -max]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(px, [-0.5, 0.5], [-max, max]), { stiffness: 200, damping: 20 })
  const move = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === 'touch') return
    const r = e.currentTarget.getBoundingClientRect()
    px.set((e.clientX - r.left) / r.width - 0.5); py.set((e.clientY - r.top) / r.height - 0.5)
  }
  const leave = () => { px.set(0); py.set(0) }
  return <motion.div onPointerMove={move} onPointerLeave={leave} style={{ rotateX, rotateY, transformPerspective: 900 }} className={className}>{children}</motion.div>
}
