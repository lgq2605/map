import { test, expect } from 'vitest'
import L from 'leaflet'
import { tl } from '../src/scenes/VietnamMapScene'

// Hồi quy lỗi "phóng to thì bản đồ chuyển thành màu xanh dương đen": glide() gọi setView(animate:false) mỗi khung hình,
// mà Leaflet mặc định xoá sạch toàn bộ ô bản đồ ở mỗi lần như vậy (sự kiện viewprereset → _invalidateAll).
// (jsdom không có CSS 3D nên Leaflet làm tròn zoom về số nguyên: dùng các cấp zoom nguyên để đổi cấp.)
const URL = 'https://example.test/{z}/{x}/{y}.png'

function setup(layerFactory: () => L.TileLayer) {
  const el = document.createElement('div')
  Object.defineProperty(el, 'clientWidth', { value: 800 }); Object.defineProperty(el, 'clientHeight', { value: 600 })
  document.body.appendChild(el)
  const m = L.map(el, { zoomControl: false }).setView([16, 107.8], 5)
  layerFactory().addTo(m)
  const tiles = () => Array.from(el.querySelectorAll('img.leaflet-tile'))
  const loaded = () => tiles().forEach(t => { Object.defineProperty(t, 'complete', { value: true }); t.dispatchEvent(new Event('load')) })
  loaded() // mô phỏng: ô ở cấp zoom 5 đã tải xong (đang hiển thị)
  return { m, tiles, loaded }
}
const survivors = (first: Element[], now: Element[]) => now.filter(t => first.includes(t)).length

test('Leaflet gốc: đổi cấp zoom bằng setView(animate:false) xoá hết ô đang hiển thị (nguyên nhân lộ nền xanh đen)', () => {
  const { m, tiles } = setup(() => L.tileLayer(URL))
  const first = tiles()
  expect(first.length).toBeGreaterThan(0)
  m.setView([16, 107.8], 6, { animate: false })
  expect(survivors(first, tiles())).toBe(0)
})

test('tl(): đổi cấp zoom bằng setView(animate:false) vẫn giữ ô cũ làm nền cho tới khi ô mới tải xong', () => {
  const { m, tiles, loaded } = setup(() => tl(URL, {}))
  const first = tiles()
  expect(first.length).toBeGreaterThan(0)
  m.setView([16, 107.8], 6, { animate: false })
  expect(survivors(first, tiles())).toBeGreaterThan(0)
  // ô mới tải xong thì ô cũ được dọn đi, không tích tụ
  loaded()
  expect(survivors(first, tiles())).toBe(0)
})
