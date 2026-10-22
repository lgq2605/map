import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Scene } from '../data/types'
import vietnam from '../data/vietnam.geo.json'
import ChoiceModal from '../components/ChoiceModal'
import NguyenHueScene from './NguyenHueScene'
import NguyenDuScene from './NguyenDuScene'
import NamKyScene from './NamKyScene'

const NAMBO: L.LatLngBoundsLiteral = [[8.4, 104.4], [12.0, 107.6]]
const FOCUS: Record<string, { c: L.LatLngTuple; z: number }> = {
  menu: { c: [16, 107.8], z: 5 }, hue: { c: [10.7743, 106.7038], z: 17 },
  du: { c: [10.7797, 106.6987], z: 18 }, namky: { c: [10.5, 106.5], z: 8 },
}
// Màn tổng quan: tô đỏ. Khi đã zoom vào khu vực: chỉ còn đường viền.
const FILL = { color: '#da251d', weight: 2, fill: true, fillColor: '#da251d', fillOpacity: 0.28, opacity: 1 }
const LINE = { color: '#ffcd00', weight: 2, fill: false, opacity: 0.9 }
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services'

const tl = (url: string, o: L.TileLayerOptions) => L.tileLayer(url, { maxZoom: 19, ...o })
const carto = (style: string) => tl(`https://{s}.basemaps.cartocdn.com/${style}/{z}/{x}/{y}{r}.png`, { subdomains: 'abcd', attribution: '© OpenStreetMap contributors © CARTO' })

// Nếu nhà cung cấp đầu tiên không tải được ô bản đồ nào, tự chuyển sang nhà cung cấp dự phòng.
function makeBase(providers: L.TileLayer[], extra: L.Layer[], onFail: () => void) {
  const group = L.layerGroup([providers[0], ...extra])
  let i = 0, ok = 0, bad = 0
  providers.forEach((p, idx) => {
    p.on('tileload', () => { ok++ })
    p.on('tileerror', () => {
      if (ok || idx !== i || ++bad < 3) return
      bad = 0
      if (i < providers.length - 1) { group.removeLayer(providers[i]); group.addLayer(providers[++i]) } else onFail()
    })
  })
  return group
}

const pin = (label: string, cls = '', emoji = '', side: 'left' | 'right' = 'right') => L.divIcon({
  className: '', iconSize: [0, 0],
  html: `<div class="relative">${emoji ? `<div class="-translate-x-1/2 -translate-y-1/2 text-3xl">${emoji}</div>` : `<div class="pulse ${cls}"></div>`}<span class="absolute top-3 whitespace-nowrap rounded bg-navy/85 px-2 py-1 text-xs text-paper ${side === 'left' ? 'right-4' : 'left-4'}">${label}</span></div>`,
})

export default function VietnamMapScene({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const base = useRef<{ sat: L.LayerGroup; street: L.LayerGroup; vn: L.GeoJSON } | null>(null)
  const [failed, setFailed] = useState(false)
  const back = () => setScene('menu')
  const panel = scene === 'hue' || scene === 'du' || scene === 'namky'

  useEffect(() => {
    const m = L.map(el.current!, { zoomControl: false, maxZoom: 19 }).setView([16, 107.8], 2)
    const onFail = () => setFailed(true)
    // Ảnh vệ tinh (maxNativeZoom 16: zoom sâu hơn thì phóng to ảnh, không bị ô xám "chưa có dữ liệu")
    const sat = makeBase([
      tl(`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 16, attribution: 'Tiles © Esri' }), carto('dark_all'),
    ], [tl(`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 12 })], onFail).addTo(m)
    // Bản đồ đường phố cho cấp độ zoom sát (thấy tên đường Nguyễn Huệ, Nguyễn Du)
    const street = makeBase([tl('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { attribution: '© OpenStreetMap contributors' }), carto('rastertiles/voyager')], [], onFail)
    const vn = L.geoJSON(vietnam as any, { style: FILL }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    base.current = { sat, street, vn }
    map.current = m
    return () => { m.remove() }
  }, [])

  useEffect(() => {
    const m = map.current, g = layer.current, b = base.current
    if (!m || !g || !b) return
    g.clearLayers()
    const f = FOCUS[scene]
    m.invalidateSize()
    if (scene === 'hue' || scene === 'du') { m.removeLayer(b.sat); if (!m.hasLayer(b.street)) b.street.addTo(m) }
    else { m.removeLayer(b.street); if (!m.hasLayer(b.sat)) b.sat.addTo(m) }
    b.vn.setStyle(scene === 'menu' ? FILL : LINE)
    m.flyTo(f.c, f.z, { duration: 1.5 })
    if (scene === 'menu') {
      // hai nhãn đặt hai phía (phải/trái) và hai điểm cách xa nhau để không chồng lên nhau
      L.marker([10.7769, 106.7009], { icon: pin('TP. Hồ Chí Minh — Nguyễn Huệ & Nguyễn Du', '', '', 'right') }).addTo(g)
      L.marker([9.6, 105.3], { icon: pin('Nam Kỳ Khởi Nghĩa — Nam Bộ', 'red', '', 'left') }).addTo(g)
      L.rectangle(NAMBO, FILL).addTo(g)
    }
    if (scene === 'namky') L.rectangle(NAMBO, { color: '#ffcd00', weight: 3, fill: false, dashArray: '8 8', className: 'march' }).addTo(g)
    if (scene === 'hue') L.marker(FOCUS.hue.c, { icon: pin('Đường Nguyễn Huệ') }).addTo(g)
    if (scene === 'du') L.marker(FOCUS.du.c, { icon: pin('THCS & THPT Trần Đại Nghĩa — 53 Nguyễn Du', '', '🏫') }).addTo(g)
  }, [scene])

  return (
    <div className="relative h-full">
      <div ref={el} className={'relative z-0 w-full bg-navy ' + (panel ? 'h-[42%] md:h-full' : 'h-full')} />
      {failed && <div className="absolute left-1/2 top-20 z-20 w-[min(90%,32rem)] -translate-x-1/2 rounded-lg bg-navy/90 px-4 py-2 text-center text-sm text-gold">Không tải được ảnh bản đồ nền. Hãy kiểm tra mạng, tắt VPN hoặc trình chặn quảng cáo rồi tải lại trang.</div>}
      {scene === 'menu' && <ChoiceModal onPick={setScene} />}
      {scene === 'hue' && <NguyenHueScene onBack={back} />}
      {scene === 'du' && <NguyenDuScene onBack={back} />}
      {scene === 'namky' && <NamKyScene onBack={back} />}
    </div>
  )
}
