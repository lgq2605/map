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
  return new THREE.LineSegments(g, new THREE.LineBasicMaterial({ color: 0xffcd00, transparent: true, opacity: 0.17, depthWrite: false }))
}
// Lớp quầng sáng thứ hai (vàng gold mỏng) bằng shader phát sáng ở rìa địa cầu
function goldGlow(R: number) {
  const m = new THREE.ShaderMaterial({
    uniforms: { uColor: { value: new THREE.Color('#ffcd00') } },
    vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
    fragmentShader: 'varying vec3 vN; uniform vec3 uColor; void main(){ float i = pow(max(0.0, 0.6 - dot(vN, vec3(0.0,0.0,1.0))), 3.5) * 0.9; gl_FragColor = vec4(uColor * i, i); }',
    side: THREE.BackSide, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
  })
  return new THREE.Mesh(new THREE.SphereGeometry(R * 1.075, 64, 64), m)
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
        atmosphereColor="#7fb7ff" atmosphereAltitude={0.2}
        pointsData={[VN]} pointLat="lat" pointLng="lng" pointColor={() => '#ff3b30'} pointAltitude={0.012} pointRadius={0.32}
        ringsData={[VN]} ringLat="lat" ringLng="lng" ringColor={() => (t: number) => `rgba(255,59,48,${1 - t})`} ringMaxRadius={4.5} ringPropagationSpeed={2} ringRepeatPeriod={1500}
        htmlElementsData={[VN]} htmlLat="lat" htmlLng="lng" htmlAltitude={0.07} htmlElement={vnLabel} htmlElementVisibilityModifier={hideBehind}
        onGlobeReady={() => {
          const g = globe.current
          if (!g) return
          // mỗi lần mở web, địa cầu hiện một mặt ngẫu nhiên
          g.pointOfView({ lat: Math.random() * 100 - 40, lng: Math.random() * 360 - 180, altitude: 2.5 }, 0)
          const c = g.controls(); if (c) { c.autoRotate = true; c.autoRotateSpeed = 0.3; c.enableZoom = false }
          const R = g.getGlobeRadius()
          g.scene().add(graticule(R * 1.003), goldGlow(R))
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
      {/* Sóng xung kích lan ra khi máy bay chạm Việt Nam (tâm màn hình) */}
      {landed && [0, 0.18, 0.36].map(d => (
        <motion.span key={d} aria-hidden="true" className="pointer-events-none absolute left-1/2 top-1/2 z-20 h-24 w-24 rounded-full border-2 border-gold"
          style={{ x: '-50%', y: '-50%', boxShadow: '0 0 24px #ffcd00, inset 0 0 24px #da251d' }}
          initial={{ scale: 0.1, opacity: 0.9 }} animate={{ scale: 9, opacity: 0 }} transition={{ duration: 1.3, delay: d, ease: 'easeOut' }} />
      ))}
      <div ref={veil} className="pointer-events-none absolute inset-0 z-30 bg-navy opacity-0" />
    </div>
  )
}
