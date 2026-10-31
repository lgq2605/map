import { useEffect, useRef, useState } from 'react'
import Globe, { type GlobeMethods } from 'react-globe.gl'
import * as THREE from 'three'
import gsap from 'gsap'
import { motion } from 'framer-motion'
import PaperPlane from '../components/PaperPlane'
import Spinner from '../components/Spinner'
import { useTypewriter } from '../components/useTypewriter'

const VN = { lat: 16, lng: 107.8 } // điểm Việt Nam trên địa cầu (cũng là điểm máy bay lao tới)

// Phần tử HTML nổi: nhãn "VIỆT NAM" (font Cinzel, rơi về Playfair cho ký tự có dấu)
const vnLabel = () => {
  const d = document.createElement('div')
  d.className = 'vn-label'
  d.innerHTML = '<b>VIỆT NAM</b><i></i>'
  return d
}
// Nhãn nằm ở mặt sau địa cầu thì ẩn đi
const hideBehind = (el: HTMLElement, visible: boolean) => { el.style.visibility = visible ? 'visible' : 'hidden' }

// Lưới kinh/vĩ tuyến vàng mờ — cảm giác "bản đồ cổ". Toạ độ theo quy ước của three-globe.
function graticule(R: number) {
  const pos: number[] = []
  const at = (lat: number, lng: number) => {
    const phi = (90 - lat) * Math.PI / 180, th = (90 - lng) * Math.PI / 180
    return [R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)]
  }
  for (let lat = -75; lat <= 75; lat += 15) for (let lng = -180; lng < 180; lng += 5) pos.push(...at(lat, lng), ...at(lat, lng + 5))
  for (let lng = -180; lng < 180; lng += 15) for (let lat = -90; lat < 90; lat += 5) pos.push(...at(lat, lng), ...at(lat + 5, lng))
  const g = new THREE.BufferGeometry()
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xffcd00, transparent: true, opacity: 0.12, depthWrite: false }))
}
export default function EarthScene({ onDone }: { onDone: () => void }) {
  const globe = useRef<GlobeMethods>(undefined)
  const veil = useRef<HTMLDivElement>(null)
  const [plane, setPlane] = useState<{ x: number; y: number } | null>(null)
  const [landed, setLanded] = useState(false)
  const [ready, setReady] = useState(false)
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
    setPlane({ x: e.clientX, y: e.clientY })
    globe.current.pointOfView({ lat: VN.lat, lng: VN.lng, altitude: 2.2 }, 1800)
  }
  const zoomIn = () => {
    const o = { alt: 2.2 }
    gsap.to(o, { alt: 0.35, duration: 2.5, ease: 'power2.inOut', onUpdate: () => globe.current?.pointOfView({ lat: VN.lat, lng: VN.lng, altitude: o.alt }) })
    gsap.to(veil.current, { opacity: 1, duration: 0.7, delay: 1.9, onComplete: onDone })
  }

  return (
    <div className={'relative h-full ' + (plane ? 'landed' : '')}>
      <Globe ref={globe} width={size.w} height={size.h}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)" /* nền trong suốt: lộ bầu trời sao + gradient của trang */
        atmosphereColor="#7fb7ff" atmosphereAltitude={0.16}
        pointsData={[VN]} pointLat="lat" pointLng="lng" pointColor={() => '#ff3b30'} pointAltitude={0.012} pointRadius={0.32}
        htmlElementsData={[VN]} htmlLat="lat" htmlLng="lng" htmlAltitude={0.07} htmlElement={vnLabel} htmlElementVisibilityModifier={hideBehind}
        onGlobeReady={() => {
          const g = globe.current
          if (!g) return
          // mỗi lần mở web, địa cầu hiện một mặt ngẫu nhiên
          g.pointOfView({ lat: Math.random() * 100 - 40, lng: Math.random() * 360 - 180, altitude: 2.5 }, 0)
          const c = g.controls(); if (c) { c.autoRotate = true; c.autoRotateSpeed = 0.3; c.enableZoom = false }
          const R = g.getGlobeRadius()
          g.scene().add(graticule(R * 1.003))
          g.renderer().setPixelRatio(Math.min(devicePixelRatio || 1, 1.5)) // máy màn hình độ phân giải cao: giới hạn để không giật
          setReady(true)
        }}
        onGlobeClick={(_c, e) => start(e)} />
      {!ready && <div className="pointer-events-none absolute inset-0 grid place-items-center"><Spinner size={56} /></div>}
      <div className={'pointer-events-none absolute inset-0 transition-opacity duration-700 ' + (plane ? 'opacity-0' : '')}>
        <motion.h1 initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2 }}
          className="gold-text absolute inset-x-0 top-[10%] px-4 text-center font-serif text-3xl font-bold md:text-6xl">Một cái tên, ngàn câu chuyện</motion.h1>
        {/* Khung viền mảnh góc cắt (corner brackets) + chữ gõ + con trỏ nhấp nháy */}
        <div className="absolute inset-x-0 bottom-10 flex justify-center px-4">
          <div className="relative px-7 py-3">
            {['left-0 top-0 border-l-2 border-t-2', 'right-0 top-0 border-r-2 border-t-2', 'bottom-0 left-0 border-b-2 border-l-2', 'bottom-0 right-0 border-b-2 border-r-2'].map(c => <span key={c} aria-hidden="true" className={'absolute h-3.5 w-3.5 border-gold ' + c} />)}
            <p className="font-serif text-base text-paper/90 md:text-xl">{hint.text}<span className="caret" aria-hidden="true" /></p>
          </div>
        </div>
        <span className="absolute bottom-3 right-4 text-[11px] text-paper/60">Gia Quân - 10CTin2 LHP</span>
      </div>
      {plane && <PaperPlane from={plane} onNear={zoomIn} onLand={() => setLanded(true)} />}
      {/* Vòng sóng lan ra khi máy bay chạm Việt Nam (tâm màn hình) — nét mảnh, không phát sáng */}
      {landed && [0, 0.18, 0.36].map(d => (
        <motion.span key={d} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-24 w-24 rounded-full border-2 border-gold"
          style={{ x: '-50%', y: '-50%' }}
          initial={{ scale: 0.1, opacity: 0.9 }} animate={{ scale: 9, opacity: 0 }} transition={{ duration: 1.3, delay: d, ease: 'easeOut' }} />
      ))}
      <div ref={veil} className="pointer-events-none absolute inset-0 z-30 bg-navy opacity-0" />
    </div>
  )
}
