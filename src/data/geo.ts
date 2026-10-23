// Dữ liệu vị trí lấy từ OpenStreetMap (Overpass API) — cùng nguồn với lớp bản đồ đường phố đang hiển thị,
// nên đường tô sáng và ghim trường luôn khớp với bản đồ nền. Không tự gõ toạ độ bằng tay.
export type LL = [number, number]
export interface Road { name: string; pts: LL[]; area: boolean }
export interface GeoResult { roads: Road[]; school: LL | null }

export const ROAD_HUE = 'Nguyễn Huệ'
export const ROAD_DU = 'Nguyễn Du'
export const ROAD_NAMKY = 'Nam Kỳ Khởi Nghĩa'

// So tên đường không phân biệt hoa/thường và bỏ chữ "Đường " ở đầu (OSM đặt tên không thống nhất)
const baseName = (n: string) => n.replace(/^Đường\s+/i, '').trim().toLocaleLowerCase('vi')
export const roadsNamed = (geo: GeoResult | null, name: string) =>
  (geo?.roads ?? []).filter(r => baseName(r.name ?? '') === baseName(name))

// Khung tìm kiếm (nam, tây, bắc, đông) bao quanh trung tâm Quận 1 – Quận 3: đủ rộng để chứa cả đường Nam Kỳ Khởi Nghĩa
const BBOX = '10.762,106.672,10.796,106.714'
const QUERY = `[out:json][timeout:25];
(way["highway"]["name"~"^(Đường )?(${ROAD_HUE}|${ROAD_DU}|${ROAD_NAMKY})$",i](${BBOX}););
out geom;
nwr["amenity"="school"]["name"~"Trần Đại Nghĩa|Tran Dai Nghia|Taberd"](${BBOX});
out center;`
const ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
  'https://overpass.private.coffee/api/interpreter',
]
const CACHE_KEY = 'hanhtrinh-geo-v2' // v2: có thêm đường Nam Kỳ Khởi Nghĩa (bản cũ trong localStorage không có)
const CACHE_MS = 30 * 24 * 3600 * 1000

// Dự phòng khi không tải được dữ liệu: trục đường Nguyễn Huệ (dài 670 m, tâm 10.774112, 106.703619 theo Wikipedia,
// chạy từ UBND TP.HCM ở phía tây bắc tới bến Bạch Đằng ở phía đông nam).
// Vị trí XẤP XỈ của trường (53 Nguyễn Du), chỉ dùng khi không tải được dữ liệu OSM để ghim trường luôn hiện.
// Muốn chính xác hơn: Google Maps → bấm chuột phải vào trường → bấm vào toạ độ để sao chép rồi dán vào đây.
export const FALLBACK_SCHOOL: LL | null = [10.7797, 106.6987]

export const FALLBACK_HUE: LL[] = [[10.776283, 106.701491], [10.771941, 106.705747]]

// Chuyển kết quả Overpass thành dữ liệu dùng được (tách riêng để dễ kiểm thử)
export function parseOverpass(json: any): GeoResult {
  const roads: Road[] = []
  let school: LL | null = null
  for (const e of json?.elements ?? []) {
    const tags = e.tags ?? {}
    if (e.type === 'way' && tags.highway && Array.isArray(e.geometry) && e.geometry.length > 1) {
      const pts = e.geometry.map((p: any) => [p.lat, p.lon] as LL)
      const closed = pts.length > 3 && pts[0][0] === pts.at(-1)![0] && pts[0][1] === pts.at(-1)![1]
      roads.push({ name: tags.name, pts, area: closed && (tags.area === 'yes' || tags.highway === 'pedestrian') })
    } else if (tags.amenity === 'school' && !school) {
      const c = e.center ?? (e.lat != null ? { lat: e.lat, lon: e.lon } : null)
      if (c) school = [c.lat, c.lon]
    }
  }
  return { roads, school }
}

async function post(url: string, body: string, ms = 14000) {
  const ctl = new AbortController()
  const timer = setTimeout(() => ctl.abort(), ms)
  try {
    const r = await fetch(url, { method: 'POST', body: 'data=' + encodeURIComponent(body), signal: ctl.signal, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
    if (!r.ok) throw new Error(String(r.status))
    return await r.json()
  } finally { clearTimeout(timer) }
}

// Nếu OSM không có đối tượng "trường" thì hỏi Nominatim địa chỉ 53 Nguyễn Du, Sài Gòn, Hồ Chí Minh
async function findSchoolByAddress(): Promise<LL | null> {
  try {
    const url = 'https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&bounded=1&viewbox=106.672,10.796,106.714,10.762&q=' + encodeURIComponent('53 Nguyễn Du, Hồ Chí Minh')
    const r = await fetch(url)
    const j = await r.json()
    return j?.[0] ? [Number(j[0].lat), Number(j[0].lon)] : null
  } catch { return null }
}

let pending: Promise<GeoResult | null> | null = null

export function loadGeo(): Promise<GeoResult | null> {
  if (pending) return pending
  pending = (async () => {
    if (typeof fetch !== 'function') return null
    try {
      const c = JSON.parse(localStorage.getItem(CACHE_KEY) ?? 'null')
      if (c && Date.now() - c.t < CACHE_MS && c.data?.roads?.length) return c.data as GeoResult
    } catch { /* bỏ qua: không có localStorage */ }
    for (const url of ENDPOINTS) {
      try {
        const data = parseOverpass(await post(url, QUERY))
        if (!data.roads.length) continue
        if (!data.school) data.school = await findSchoolByAddress()
        try { localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), data })) } catch { /* bỏ qua */ }
        return data
      } catch { /* thử máy chủ tiếp theo */ }
    }
    return null
  })().then(r => { if (!r) pending = null; return r }) // lỗi mạng: lần sau thử lại
  return pending
}
