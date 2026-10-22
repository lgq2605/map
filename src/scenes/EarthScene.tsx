import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import gsap from 'gsap'
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
        onGlobeReady={() => { const c = globe.current?.controls(); if (c) { c.autoRotate = true; c.autoRotateSpeed = 0.3; c.enableZoom = false } }}
        onGlobeClick={(_c, e) => start(e)} />
      <p className="pointer-events-none absolute bottom-10 w-full px-4 text-center font-serif text-base text-paper/80 glow md:text-xl">{hint.text}</p>
      {plane && <PaperPlane from={plane} onNear={zoomIn} />}
      <div ref={veil} className="pointer-events-none absolute inset-0 z-30 bg-navy opacity-0" />
    </div>
  )
}
