import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Scene } from '../data/types'
import ChoiceModal from '../components/ChoiceModal'
import NguyenHueScene from './NguyenHueScene'
import NguyenDuScene from './NguyenDuScene'
import NamKyScene from './NamKyScene'

const VN: L.LatLngTuple[] = [[23.3,105.4],[22.8,106.7],[21.9,106.7],[21.5,107.9],[21.0,107.0],[20.0,106.0],[19.0,105.7],[18.0,106.2],[17.0,107.2],[16.1,108.2],[15.0,109.0],[13.8,109.3],[12.3,109.2],[11.3,109.0],[10.7,107.9],[10.4,107.0],[9.5,106.5],[8.6,105.0],[9.8,104.8],[10.4,104.5],[11.0,105.8],[11.7,106.0],[12.5,107.5],[13.9,107.5],[15.0,107.6],[16.0,107.2],[17.0,105.8],[18.5,105.0],[19.8,104.2],[20.7,104.0],[21.5,102.2],[22.5,102.2],[22.8,104.0]]
const NAMBO: L.LatLngBoundsLiteral = [[8.4, 104.4], [12.0, 107.6]]
const FOCUS: Record<string, { c: L.LatLngTuple; z: number }> = {
  menu: { c: [16, 107.8], z: 5 }, hue: { c: [10.7743, 106.7038], z: 17 },
  du: { c: [10.7797, 106.6987], z: 18 }, namky: { c: [10.5, 106.5], z: 8 },
}
const red = { color: '#da251d', weight: 2, fillColor: '#da251d', fillOpacity: 0.28 }
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services'

const pin = (label: string, cls = '', emoji = '') => L.divIcon({
  className: '', iconSize: [0, 0],
  html: `<div class="relative">${emoji ? `<div class="-translate-x-1/2 -translate-y-1/2 text-3xl">${emoji}</div>` : `<div class="pulse ${cls}"></div>`}<span class="absolute left-4 top-3 whitespace-nowrap rounded bg-navy/85 px-2 py-1 text-xs text-paper">${label}</span></div>`,
})

export default function VietnamMapScene({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const back = () => setScene('menu')
  const panel = scene === 'hue' || scene === 'du' || scene === 'namky'

  useEffect(() => {
    const m = L.map(el.current!, { zoomControl: false, maxZoom: 19 }).setView([16, 107.8], 2)
    L.tileLayer(`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 19, attribution: 'Tiles © Esri' }).addTo(m)
    L.tileLayer(`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, { maxZoom: 19 }).addTo(m)
    L.polygon(VN, { ...red, fillOpacity: 0.2 }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    map.current = m
    return () => { m.remove() }
  }, [])

  useEffect(() => {
    const m = map.current, g = layer.current
    if (!m || !g) return
    g.clearLayers()
    const f = FOCUS[scene]
    m.invalidateSize()
    m.flyTo(f.c, f.z, { duration: 1.5 })
    if (scene === 'menu') {
      L.marker([10.7769, 106.7009], { icon: pin('TP. Hồ Chí Minh — Nguyễn Huệ & Nguyễn Du') }).addTo(g)
      L.marker([11.0, 106.0], { icon: pin('Nam Kỳ Khởi Nghĩa — Nam Bộ', 'red') }).addTo(g)
    }
    if (scene === 'menu' || scene === 'namky') L.rectangle(NAMBO, red).addTo(g)
    if (scene === 'namky') L.rectangle(NAMBO, { color: '#ffcd00', weight: 3, fill: false, dashArray: '8 8', className: 'march' }).addTo(g)
    if (scene === 'hue') L.marker(FOCUS.hue.c, { icon: pin('Đường Nguyễn Huệ') }).addTo(g)
    if (scene === 'du') L.marker(FOCUS.du.c, { icon: pin('THCS & THPT Trần Đại Nghĩa — 53 Nguyễn Du', '', '🏫') }).addTo(g)
  }, [scene])

  return (
    <div className="relative h-full">
      <div ref={el} className={'relative z-0 w-full bg-navy ' + (panel ? 'h-[42%] md:h-full' : 'h-full')} />
      {scene === 'menu' && <ChoiceModal onPick={setScene} />}
      {scene === 'hue' && <NguyenHueScene onBack={back} />}
      {scene === 'du' && <NguyenDuScene onBack={back} />}
      {scene === 'namky' && <NamKyScene onBack={back} />}
    </div>
  )
}
