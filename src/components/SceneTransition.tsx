import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { whoosh } from '../audio'

// Chuyển cảnh điện ảnh: dải gradient đỏ → vàng → đỏ quét ngang màn hình (0,6s) mỗi khi đổi scene.
export default function SceneTransition({ trigger }: { trigger: string }) {
  const first = useRef(true)
  const reduce = useReducedMotion()
  const [k, setK] = useState(0)
  useEffect(() => {
    if (first.current) { first.current = false; return }
    whoosh()
    if (!reduce) setK(n => n + 1)
  }, [trigger])
  if (!k) return null
  return (
    <motion.div key={k} aria-hidden="true" className="pointer-events-none fixed inset-y-0 left-0 z-[70] w-[65vw]"
      style={{ background: 'linear-gradient(100deg, transparent 0%, rgba(218,37,29,.85) 28%, #ffcd00 50%, rgba(218,37,29,.85) 72%, transparent 100%)' }}
      initial={{ x: '-70vw' }} animate={{ x: '110vw' }} transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      onAnimationComplete={() => setK(0)} />
  )
}
