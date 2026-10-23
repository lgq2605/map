import { test, expect } from 'vitest'
import { parseOverpass } from '../src/data/geo'

test('parseOverpass: tách đường, khu vực đi bộ (đường khép kín) và vị trí trường', () => {
  const g = (...p: [number, number][]) => p.map(([lat, lon]) => ({ lat, lon }))
  const r = parseOverpass({ elements: [
    { type: 'way', tags: { highway: 'tertiary', name: 'Nguyễn Du' }, geometry: g([1, 1], [2, 2]) },
    { type: 'way', tags: { highway: 'pedestrian', area: 'yes', name: 'Nguyễn Huệ' }, geometry: g([1, 1], [1, 2], [2, 2], [1, 1]) },
    { type: 'way', tags: { amenity: 'school', name: 'Trần Đại Nghĩa' }, center: { lat: 10.5, lon: 106.5 } },
    { type: 'way', tags: { highway: 'service' }, geometry: g([1, 1]) }, // chỉ 1 điểm: bỏ qua
  ] })
  expect(r.roads.map(x => [x.name, x.area])).toEqual([['Nguyễn Du', false], ['Nguyễn Huệ', true]])
  expect(r.school).toEqual([10.5, 106.5])
})

test('parseOverpass: dữ liệu rỗng hoặc hỏng không gây lỗi', () => {
  expect(parseOverpass(null)).toEqual({ roads: [], school: null })
  expect(parseOverpass({})).toEqual({ roads: [], school: null })
})
