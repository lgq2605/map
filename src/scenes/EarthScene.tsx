import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import { setMusic } from '../audio'
import PaperPlane from '../components/PaperPlane'
import { useTypewriter } from '../components/useTypewriter'

export default function EarthScene({ onDone }: { onDone: () => void }) {
  const globe = useRef<GlobeMethods>(undefined)
  const veil = useRef<HTMLDivElement>(null)
  const [plane, setPlane] = useState<{ x: number; y: number } | null>(null)
  const [size, setSize] = useState({ w: innerWidth, h: innerHeight })
  const hint = useTypewriter('Chạm vào Trái Đất để bắt đầu hành trình…', true, 60)

  useEffect(() => {
    const onResize = () => setSize({ w: innerWidth, h: innerHeight })
    addEventListener('resize', onResize)
    return () => removeEventListener('resize', onResize)
  }, [])

  const start = (e: MouseEvent) => {
    if (plane || !globe.current) return
    globe.current.controls().autoRotate = false
    setMusic(true)
    setPlane({ x: e.clientX, y: e.clientY })
    globe.current.pointOfView({ lat: 16, lng: 107.8, altitude: 2.2 }, 1800)
  }
  const zoomIn = () => {
    const o = { alt: 2.2 }
    gsap.to(o, { alt: 0.35, duration: 2.5, ease: 'power2.inOut', onUpdate: () => globe.current?.pointOfView({ lat: 16, lng: 107.8, altitude: o.alt }) })
    gsap.to(veil.current, { opacity: 1, duration: 0.7, delay: 1.9, onComplete: onDone })
  }

  return (
    <div className="relative h-full">
      <Globe ref={globe} width={size.w} height={size.h}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
        atmosphereColor="#ffcd00" atmosphereAltitude={0.22}
        onGlobeReady={() => {
          // mỗi lần mở web, địa cầu hiện một mặt ngẫu nhiên
          globe.current?.pointOfView({ lat: Math.random() * 100 - 40, lng: Math.random() * 360 - 180, altitude: 2.5 }, 0)
          const c = globe.current?.controls(); if (c) { c.autoRotate = true; c.autoRotateSpeed = 0.3; c.enableZoom = false } }}
        onGlobeClick={(_c, e) => start(e)} />
      <div className={'pointer-events-none absolute inset-0 transition-opacity duration-700 ' + (plane ? 'opacity-0' : '')}>
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}
          className="absolute inset-x-0 top-[10%] px-4 text-center font-serif text-3xl font-extrabold text-gold glow md:text-6xl">1 cái tên, ngàn câu chuyện</motion.h1>
        <p className="absolute bottom-10 w-full px-4 text-center font-serif text-base text-paper/80 glow md:text-xl">{hint.text}</p>
        <span className="absolute bottom-3 right-4 text-[11px] text-paper/40">Gia Quân - 10CTin2 LHP</span>
      </div>
      {plane && <PaperPlane from={plane} onNear={zoomIn} />}
      <div ref={veil} className="pointer-events-none absolute inset-0 z-30 bg-navy opacity-0" />
    </div>
  )
}
