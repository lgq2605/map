import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import gsap from 'gsap'
import 'leaflet/dist/leaflet.css'
import type { Scene } from '../data/types'
import vietnam from '../data/vietnam.geo.json'
import { loadGeo, roadsNamed, FALLBACK_HUE, ROAD_HUE, ROAD_DU, ROAD_NAMKY, type GeoResult } from '../data/geo'
import schoolLogo from '../assets/school-logo.png'
import ChoiceModal from '../components/ChoiceModal'
import HCMCButton from '../components/HCMCButton'
import NguyenHueScene from './NguyenHueScene'
import NguyenDuScene from './NguyenDuScene'
import NamKyScene from './NamKyScene'

const FOCUS: Record<string, { c: L.LatLngTuple; z: number }> = {
  menu: { c: [16, 107.8], z: 5 }, hcm: { c: [10.7777, 106.7009], z: 14 },
  hue: { c: [10.7743, 106.7038], z: 17 }, du: { c: [10.7792138, 106.7010202], z: 17 },
  namky: { c: [10.7795, 106.6925], z: 15 }, // chỉ dùng khi chưa có dữ liệu đường; có dữ liệu thì tự căn theo chiều dài đường
}
// Ba con đường ở TP.HCM (mỗi scene tương ứng một đường)
const ROAD_OF = { hue: ROAD_HUE, du: ROAD_DU, namky: ROAD_NAMKY } as const
type RoadScene = keyof typeof ROAD_OF

// Vị trí logo trường do người dùng chỉ định trên bản đồ
const SCHOOL_POS: [number, number] = [10.7792138, 106.7010202]

// Nhãn tên PHƯỜNG HIỆN HÀNH của TP.HCM (theo sắp xếp đơn vị hành chính cấp xã từ 01/7/2025,
// thay cho các quận cũ: Quận 1 → các phường Sài Gòn, Tân Định, Bến Thành, Cầu Ông Lãnh;
// Quận 3 → Bàn Cờ, Xuân Hòa, Nhiêu Lộc; Quận 4 → Xóm Chiếu, Khánh Hội, Vĩnh Hội...).
// Toạ độ nhãn đặt trong khu trung tâm quanh 3 con đường đang xem.
const WARDS: [string, number, number][] = [
  ['Phường Sài Gòn', 10.7822, 106.6990],
  ['Phường Tân Định', 10.7880, 106.6980],
  ['Phường Bến Thành', 10.7730, 106.6965],
  ['Phường Cầu Ông Lãnh', 10.7640, 106.6940],
  ['Phường Bàn Cờ', 10.7705, 106.6825],
  ['Phường Xuân Hòa', 10.7805, 106.6920],
  ['Phường Nhiêu Lộc', 10.7850, 106.6790],
  ['Phường Phú Nhuận', 10.7930, 106.6780],
  ['Phường Khánh Hội', 10.7630, 106.7030],
  ['Phường Xóm Chiếu', 10.7630, 106.7100],
  ['Phường Vĩnh Hội', 10.7575, 106.6980],
  ['Phường Vườn Lài', 10.7700, 106.6810],
  ['Phường Hòa Hưng', 10.7780, 106.6810],
  ['Phường Gia Định', 10.7960, 106.6990],
]
// Ngưỡng chuyển nhãn: từ cấp 13 trở lên thì ẩn lớp nhãn của nhà cung cấp (chữ bị
// phóng to vỡ dạng và còn ghi TÊN QUẬN CŨ) — thay bằng nhãn phường hiện hành ở trên.
const WARD_MIN_ZOOM = 13

// Khung viền các đảo của Việt Nam, hiện ở màn tổng quan. Hoàng Sa, Trường Sa dùng khung theo toạ độ địa lý của quần đảo;
// các đảo còn lại ôm theo hình đảo. `side`: nhãn đặt bên trái / phải / trong khung (không có = chỉ hiện tên khi rê chuột).
const ISLANDS: { name: string; b: L.LatLngBoundsLiteral; side?: 'left' | 'right' | 'in' }[] = [
  { name: 'Quần đảo Hoàng Sa', b: [[15.75, 111.0], [17.25, 113.0]], side: 'right' },
  { name: 'Quần đảo Trường Sa', b: [[6.8, 111.5], [12.0, 117.35]], side: 'in' },
  { name: 'Đảo Phú Quốc', b: [[9.95, 103.8], [10.5, 104.15]], side: 'left' },
  { name: 'Côn Đảo', b: [[8.55, 106.5], [8.85, 106.75]], side: 'right' },
  { name: 'Đảo Cát Bà', b: [[20.65, 106.88], [20.92, 107.14]], side: 'right' },
  { name: 'Đảo Phú Quý', b: [[10.45, 108.88], [10.6, 109.02]] },
  { name: 'Đảo Lý Sơn', b: [[15.33, 109.08], [15.44, 109.18]] },
]
// Màn tổng quan: tô đỏ. Khi đã zoom vào khu vực: chỉ còn đường viền.
const FILL = { color: '#da251d', weight: 2, fill: true, fillColor: '#da251d', fillOpacity: 0.28, opacity: 1 }
const LINE = { color: '#ffcd00', weight: 2, fill: false, opacity: 0.9 }
// Khung viền các đảo dùng màu đỏ theo yêu cầu (trước đây là xanh lơ)
const AREA = '#da251d'
// Màu nhãn tên đảo: đỏ sáng hơn một chút cho dễ đọc trên nền tối
const AREA_TEXT = '#ff5147'
// Đường đang xem: nét LIỀN màu xanh dương, mờ 40%, KHÔNG phát sáng —
// phủ đúng thân đường để người xem thấy rõ hình dáng con đường trên nền bản đồ.
const ROAD = '#1e90ff'
const ESRI = 'https://server.arcgisonline.com/ArcGIS/rest/services'

export const tl = (url: string, o: L.TileLayerOptions) => {
  const t = L.tileLayer(url, { maxZoom: 19, ...o })
  // Leaflet mặc định XOÁ SẠCH mọi ô bản đồ ở mỗi lần setView(animate:false) (sự kiện viewprereset → _invalidateAll).
  // glide() gọi setView mỗi khung hình nên ô bị xoá liên tục và lộ nền xanh đen khi phóng to. Bỏ bước xoá này:
  // ô cũ được giữ và phóng lớn dần, ô mới nét hơn hiện đè lên — luôn có hình ảnh khu vực.
  ;(t as any)._invalidateAll = () => {}
  return t
}

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

// Zoom liên tục và mượt (không "nhảy"): zoom kéo dài theo số cấp, điểm đích trôi dần về tâm màn hình.
// Mỗi khung hình đều cập nhật bản đồ nên các ô bản đồ được tải dần theo từng cấp (ô cũ được giữ, xem tl()).
function glide(m: L.Map, c: L.LatLngTuple, z: number, tween: { current: gsap.core.Tween | null }, done: () => void) {
  tween.current?.kill()
  const z0 = m.getZoom(), P = L.latLng(c)
  if (Math.abs(z - z0) < 0.01) { m.panTo(P); done(); return }
  const zr = Math.min(z0, z), zoomIn = z > z0
  const A = m.project(m.getCenter(), zr), B = m.project(P, zr)
  const fixed = zoomIn ? B : A, moving = zoomIn ? A : B
  const o = { t: 0 }
  tween.current = gsap.to(o, {
    t: 1, duration: Math.min(5, 0.6 + 0.35 * Math.abs(z - z0)), ease: 'power2.inOut',
    onUpdate: () => {
      const zt = z0 + (z - z0) * o.t
      const k = 2 ** (zr - zt)
      m.setView(m.unproject(fixed.add(moving.subtract(fixed).multiplyBy(k)), zr), zt, { animate: false })
    },
    onComplete: () => { m.setView(P, z, { animate: false }); done() },
  })
}

// Canh khung nhìn để thấy TRỌN các điểm cho trước (xuất hiện hết cả con đường).
// `rightPad`: chừa trước bên phải cho bảng thông tin trên máy tính — co khung lại và
// dời tâm sang phải để đường nằm gọn trong vùng bản đồ còn nhìn thấy.
function fitView(m: L.Map, pts: L.LatLngTuple[], maxZ: number, rightPad = 0): { c: L.LatLngTuple; z: number } | null {
  const bb = L.latLngBounds(pts)
  const z = m.getBoundsZoom(bb, false, L.point(rightPad + 24, 40))
  if (!Number.isFinite(z)) return null
  let c = bb.getCenter()
  if (rightPad) c = m.unproject(m.project(c, z).add(L.point(rightPad / 2, 0)), z)
  return { c: [c.lat, c.lng], z: Math.min(maxZ, z) }
}

const pin = (label: string, cls = '', emoji = '', side: 'left' | 'right' = 'right') => L.divIcon({
  className: '', iconSize: [0, 0],
  html: `<div class="relative">${emoji ? `<div class="-translate-x-1/2 -translate-y-1/2 text-3xl">${emoji}</div>` : `<div class="pulse ${cls}"></div>`}<span class="absolute top-3 whitespace-nowrap rounded bg-navy/85 px-2 py-1 text-xs text-paper ${side === 'left' ? 'right-4' : 'left-4'}">${label}</span></div>`,
})

// Ghim trường học: CHỈ LOGO của Trường THCS và THPT Trần Đại Nghĩa (logo chính thức),
// không kèm chữ tên trường hay địa chỉ. Nền tròn xanh đêm + viền vàng cho nổi trên bản đồ.
const schoolIcon = () => L.divIcon({
  className: '', iconSize: [0, 0],
  html: `<div class="relative"><img src="${schoolLogo}" alt="Logo trường THCS và THPT Trần Đại Nghĩa" class="h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-gold bg-navy object-contain shadow-lg shadow-black/60"/></div>`,
})

// Nhãn tên phường hiện hành (xem WARDS): chữ nhỏ cố định, không tương tác,
// tự ẩn/hiện theo cấp zoom (WARD_MIN_ZOOM) — xem syncLabelLayers bên dưới.
const wardIcon = (name: string) => L.divIcon({
  className: '', iconSize: [0, 0],
  html: `<div class="ward-label">${name}</div>`,
})

// Nhãn tên đảo đặt ở mép khung
const islandTag = (text: string, at: L.LatLngTuple, side: 'left' | 'right' | 'in') => L.marker(at, {
  interactive: false,
  icon: L.divIcon({ className: '', iconSize: [0, 0], html: `<div class="relative"><span class="absolute whitespace-nowrap rounded bg-navy/80 px-1.5 py-0.5 text-[11px] text-[#ff5147] ${side === 'left' ? 'right-1 -translate-y-1/2' : side === 'right' ? 'left-1 -translate-y-1/2' : 'left-1 top-1'}">${text}</span></div>` }),
})

// Tô sáng đường đang xem (dữ liệu hình dạng đường lấy từ OpenStreetMap, xem data/geo.ts):
// nét liền màu xanh dương mờ 40%, không phát sáng — phủ đúng thân đường để thấy rõ hình dáng.
// `w`: độ dày nét (mặc định khi xem một đường; màn TP.HCM dùng nét mảnh hơn).
function highlight(g: L.LayerGroup, sc: RoadScene, geo: GeoResult | null, w = 14) {
  const name = ROAD_OF[sc]
  let roads = roadsNamed(geo, name)
  if (!roads.length && sc === 'hue') roads = [{ name, pts: FALLBACK_HUE, area: false }]
  roads.forEach(r => {
    if (r.area) L.polygon(r.pts, { color: ROAD, weight: 2, opacity: 0.4, fillColor: ROAD, fillOpacity: 0.4, interactive: false }).addTo(g)
    else L.polyline(r.pts, { color: ROAD, weight: w, opacity: 0.4, lineCap: 'round', lineJoin: 'round', interactive: false }).addTo(g)
  })
}

// Điểm giữa của đoạn đường dài nhất (để đặt nhãn tên đường)
function roadMiddle(geo: GeoResult | null, name: string): L.LatLngTuple | null {
  const w = roadsNamed(geo, name).sort((a, b) => b.pts.length - a.pts.length)[0]
  return w ? w.pts[Math.floor(w.pts.length / 2)] : null
}

export default function VietnamMapScene({ scene, setScene }: { scene: Scene; setScene: (s: Scene) => void }) {
  const el = useRef<HTMLDivElement>(null)
  const map = useRef<L.Map | null>(null)
  const layer = useRef<L.LayerGroup | null>(null)
  const base = useRef<{ sat: L.LayerGroup; street: L.LayerGroup; vn: L.GeoJSON } | null>(null)
  const [failed, setFailed] = useState(false)
  const tween = useRef<gsap.core.Tween | null>(null)
  const geo = useRef<GeoResult | null>(null)
  // Đường Nguyễn Du: mốc đang xem (0 = 1874: thấy TRỌN con đường; ≥1 = từ 1976: phóng to trường
  // nhưng vẫn thấy khu vực xung quanh). aimRef lưu hàm tính khung nhìn hiện tại để nút "Tiếp theo"
  // trong bảng thông tin có thể lái bản đồ theo mốc.
  const duStep = useRef(0)
  const aimRef = useRef<(() => { c: L.LatLngTuple; z: number }) | null>(null)
  // Xem xong một con đường: quay lại màn chọn 3 con đường ở TP.HCM (không quay ra toàn quốc)
  const back = () => setScene('hcm')
  const road = scene === 'hue' || scene === 'du' || scene === 'namky'
  const panel = road

  useEffect(() => {
    const m = L.map(el.current!, { zoomControl: false, maxZoom: 19, zoomSnap: 0 }).setView([16, 107.8], 2)
    const onFail = () => setFailed(true)
    // Ảnh vệ tinh, LUÔN nằm dưới cùng và không bao giờ bị gỡ: khi phóng to/thu nhỏ lúc nào cũng thấy hình ảnh khu vực.
    // (maxNativeZoom 16: zoom sâu hơn thì phóng to ảnh, không bị ô xám "chưa có dữ liệu".)
    // Nhà cung cấp dự phòng cũng là ảnh vệ tinh (trước đây là bản đồ nền tối nên bị chuyển thành màu xanh đen).
    const sat = makeBase([
      tl(`${ESRI}/World_Imagery/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 16, zIndex: 1, attribution: 'Tiles © Esri' }),
      tl('https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxNativeZoom: 16, zIndex: 1, attribution: 'Tiles © Esri' }),
      tl('https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2020_3857/default/g/{z}/{y}/{x}.jpg', { maxNativeZoom: 13, zIndex: 1, attribution: 'Sentinel-2 cloudless © EOX IT Services GmbH (Copernicus Sentinel data 2020)' }),
    ], [], onFail).addTo(m)
    // Lớp nhãn "Boundaries and Places" của Esri: CHỈ dùng khi thu nhỏ (dưới cấp 13) — ngang mức
    // tỉnh/thành. Phóng sâu hơn thì chữ trên ô bị phóng to vỡ dạng và còn ghi tên quận cũ,
    // nên thay bằng nhãn PHƯỜNG HIỆN HÀNH (WARDS) cỡ chữ nhỏ cố định.
    const places = tl(`${ESRI}/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}`, { maxNativeZoom: 12, zIndex: 2 })
    const wards = L.layerGroup(WARDS.map(([n, lat, lng]) => L.marker([lat, lng], { icon: wardIcon(n), interactive: false, keyboard: false })))
    const syncLabelLayers = () => {
      const detail = m.getZoom() >= WARD_MIN_ZOOM
      if (detail === m.hasLayer(wards)) return
      if (detail) { m.removeLayer(places); m.addLayer(wards) } else { m.removeLayer(wards); m.addLayer(places) }
    }
    m.on('zoom zoomend', syncLabelLayers)
    places.addTo(m)
    syncLabelLayers()
    // Bản đồ đường phố (thấy tên đường): chỉ phủ lên ảnh vệ tinh SAU KHI zoom xong tới các con đường
    const street = makeBase([tl('https://tile.openstreetmap.org/{z}/{x}/{y}.png', { zIndex: 3, attribution: '© OpenStreetMap contributors' }), tl('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', { zIndex: 3, subdomains: 'abcd', attribution: '© OpenStreetMap contributors © CARTO' })], [], onFail)
    const vn = L.geoJSON(vietnam as any, { style: FILL }).addTo(m)
    layer.current = L.layerGroup().addTo(m)
    base.current = { sat, street, vn }
    map.current = m
    loadGeo().then(r => { geo.current = r }) // tải trước hình dạng đường trong lúc người dùng ở màn tổng quan
    return () => { tween.current?.kill(); m.remove() }
  }, [])

  useEffect(() => {
    const m = map.current, g = layer.current, b = base.current
    if (!m || !g || !b) return
    g.clearLayers()
    if (scene === 'du') duStep.current = 0 // vào lại đường Nguyễn Du: về mốc đầu tiên 1874
    const f = FOCUS[scene]
    m.invalidateSize({ animate: false })
    // Ảnh vệ tinh luôn bật. Bản đồ phố chỉ bật khi zoom xong tới đường (xem settle) và gỡ ngay khi quay ra.
    if (!m.hasLayer(b.sat)) b.sat.addTo(m)
    if (!road && m.hasLayer(b.street)) m.removeLayer(b.street)
    b.vn.setStyle(scene === 'menu' ? FILL : LINE)
    // Đích zoom: tự căn để thấy TRỌN con đường (dữ liệu OSM có thể về muộn, xem loadGeo bên dưới).
    // Màn TP.HCM: ôm cả 3 con đường. Mỗi con đường: ôm trọn đường đó; Nguyễn Du tính cả vị trí logo trường.
    // Riêng Nguyễn Du: từ mốc 1976 trở đi (duStep ≥ 1) thì phóng to TRƯỜNG nhưng vẫn thấy một phần khu vực xung quanh.
    const aim = (): { c: L.LatLngTuple; z: number } => {
      if (scene === 'hcm') {
        const pts = [ROAD_HUE, ROAD_DU, ROAD_NAMKY].flatMap(n => roadsNamed(geo.current, n).flatMap(r => r.pts))
        return (pts.length ? fitView(m, pts, 15) : null) ?? f
      }
      if (road) {
        if (scene === 'du' && duStep.current >= 1) {
          // Mốc 1976 trở đi: phóng to trường, vẫn thấy được vùng quanh trường (cấp 16).
          // Chừa trước bên phải cho bảng thông tin trên máy tính (tương tự fitView).
          const pad = matchMedia('(min-width: 768px)').matches ? Math.min(448, m.getSize().x * 0.46) : 0
          let c: L.LatLng = L.latLng(SCHOOL_POS)
          if (pad) c = m.unproject(m.project(c, 16).add(L.point(pad / 2, 0)), 16)
          return { c: [c.lat, c.lng], z: 16 }
        }
        const name = ROAD_OF[scene as RoadScene]
        let rs = roadsNamed(geo.current, name)
        if (!rs.length && scene === 'hue') rs = [{ name, pts: FALLBACK_HUE, area: false }]
        let pts = rs.flatMap(r => r.pts)
        if (scene === 'du') pts = pts.concat([SCHOOL_POS]) // thấy trọn cả đường lẫn logo trường
        if (pts.length) {
          // Trên máy tính, bảng thông tin che mất bên phải (tối đa 28rem): chừa chỗ cho nó
          const pad = matchMedia('(min-width: 768px)').matches ? Math.min(448, m.getSize().x * 0.46) : 0
          return fitView(m, pts, scene === 'namky' ? 16 : 17, pad) ?? f
        }
        if (scene === 'du') return { c: SCHOOL_POS, z: f.z }
      }
      return f
    }
    // Cuối hành trình: bật bản đồ phố (đè lên ảnh vệ tinh đã tải sẵn); dữ liệu có thể về muộn hơn lúc bắt đầu bay: căn lại cho đúng
    const settle = () => {
      if (road && !m.hasLayer(b.street)) b.street.addTo(m)
      const a = aim()
      if (m.getCenter().distanceTo(a.c) > 5 || Math.abs(m.getZoom() - a.z) > 0.05) m.flyTo(a.c, a.z, { duration: 0.8 })
    }
    aimRef.current = aim // cho onStep (Nguyễn Du) gọi lại khung nhìn theo mốc
    const a0 = aim()
    glide(m, a0.c, a0.z, tween, settle)
    if (scene === 'menu') {
      L.marker([10.7769, 106.7009], { icon: pin('TP. Hồ Chí Minh') }).addTo(g)
      // Khung viền các đảo (Hoàng Sa, Trường Sa, Phú Quốc, Côn Đảo...)
      ISLANDS.forEach(i => {
        L.rectangle(i.b, { color: AREA, weight: 2, dashArray: '5 4', fillColor: AREA, fillOpacity: 0.12 }).bindTooltip(i.name, { sticky: true }).addTo(g)
        const [[s0, w], [n, e]] = i.b
        if (i.side) islandTag(i.name, i.side === 'left' ? [(s0 + n) / 2, w] : i.side === 'right' ? [(s0 + n) / 2, e] : [n, w], i.side).addTo(g)
      })
    }
    let alive = true
    if (scene === 'hcm' || road) {
      const show = (r: GeoResult | null) => {
        g.clearLayers()
        if (scene === 'hcm') {
          // Phóng tới TP.HCM: hiện cả 3 con đường (nét mảnh) để nhìn thấy vị trí từng đường
          ;(['hue', 'du', 'namky'] as RoadScene[]).forEach(s => highlight(g, s, r, 6))
        } else {
          const sc = scene as RoadScene
          highlight(g, sc, r)
          if (sc === 'hue') L.marker(FOCUS.hue.c, { icon: pin('Đường Nguyễn Huệ') }).addTo(g)
          if (sc === 'du') L.marker(SCHOOL_POS, { icon: schoolIcon(), zIndexOffset: 1000 }).addTo(g)
          const mid = sc === 'namky' ? roadMiddle(r, ROAD_NAMKY) : null
          if (mid) L.marker(mid, { icon: pin('Đường Nam Kỳ Khởi Nghĩa', 'red') }).addTo(g)
        }
      }
      show(geo.current)
      if (!geo.current) loadGeo().then(r => {
        if (!alive || !r) return
        geo.current = r
        show(r)
        if (!tween.current?.isActive()) { const a = aim(); m.flyTo(a.c, a.z, { duration: 0.8 }) }
      })
    }
    return () => { alive = false }
  }, [scene])

  return (
    <div className="relative h-full">
      {/* Đổi chiều cao ở div bọc ngoài. Div của Leaflet (ref={el}) phải có className CỐ ĐỊNH: nếu React ghi đè className,
          các class Leaflet tự thêm (leaflet-container, ...) bị xoá và ô bản đồ co về 0px do Tailwind (img { max-width: 100% }). */}
      <div className={'relative z-0 w-full ' + (panel ? 'h-[42%] md:h-full' : 'h-full')}>
        <div ref={el} className="h-full w-full bg-navy" />
      </div>
      {failed && <div className="absolute left-1/2 top-20 z-20 w-[min(90%,32rem)] -translate-x-1/2 rounded-lg bg-navy/90 px-4 py-2 text-center text-sm text-gold">Không tải được ảnh bản đồ nền. Hãy kiểm tra mạng, tắt VPN hoặc trình chặn quảng cáo rồi tải lại trang.</div>}
      {/* Màn toàn quốc: nút thành phố Hồ Chí Minh — bấm để phóng to TP.HCM và chọn 1 trong 3 con đường */}
      {scene === 'menu' && <HCMCButton onPick={() => setScene('hcm')} />}
      {scene === 'hcm' && <ChoiceModal onPick={setScene} />}
      {scene === 'hue' && <NguyenHueScene onBack={back} />}
      {scene === 'du' && (
        <NguyenDuScene onBack={back} onStep={s => {
          duStep.current = s
          const a = aimRef.current?.()
          const mm = map.current
          if (!a || !mm) return
          // Đang bay giữa chừng thì chờ settle() tự căn theo mốc mới; đã đứng yên thì bay luôn
          if (tween.current?.isActive()) return
          if (mm.getCenter().distanceTo(L.latLng(a.c)) > 5 || Math.abs(mm.getZoom() - a.z) > 0.05) mm.flyTo(a.c, a.z, { duration: 1.4 })
        }} />
      )}
      {scene === 'namky' && <NamKyScene onBack={back} />}
    </div>
  )
}
