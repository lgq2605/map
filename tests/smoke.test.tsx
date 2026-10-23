import { vi, test, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { forwardRef, useImperativeHandle } from 'react'
import App from '../src/App'

vi.mock('react-globe.gl', () => ({
  default: forwardRef((props: any, ref: any) => {
    useImperativeHandle(ref, () => ({ controls: () => ({}), pointOfView: () => {} }))
    return <button data-testid="globe" onClick={e => props.onGlobeClick({ lat: 0, lng: 0 }, e.nativeEvent)}>globe</button>
  }),
}))

const t = { timeout: 9000 }
test('hành trình đầy đủ: địa cầu → menu 3 con đường → Nguyễn Huệ → Nam Kỳ → Nguyễn Du', async () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Một cái tên, ngàn câu chuyện' })).toBeTruthy()
  fireEvent.click(screen.getByTestId('globe'))
  // menu: 3 con đường ở TP.HCM, không còn tuỳ chọn "Khu vực TP. Hồ Chí Minh" / "Vùng Nam Bộ"
  expect(await screen.findByText(/🛣️ Đường Nguyễn Huệ/, {}, t)).toBeTruthy()
  expect(screen.getByText(/🏫 Đường Nguyễn Du/)).toBeTruthy()
  expect(screen.getByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/)).toBeTruthy()
  expect(screen.queryByText(/Khu vực TP/)).toBeNull()
  expect(screen.queryByText(/Vùng Nam Bộ/)).toBeNull()
  fireEvent.click(screen.getByText(/🛣️ Đường Nguyễn Huệ/))
  // Street View không tự bật: chỉ có nút, chưa có khung nhúng
  expect(await screen.findByRole('button', { name: /Street View/ })).toBeTruthy()
  expect(document.querySelector('iframe')).toBeNull()
  for (let i = 0; i < 3; i++) fireEvent.click(await screen.findByRole('button', { name: /Tiếp theo/ }, t))
  fireEvent.click(await screen.findByRole('button', { name: /Xem nhân vật/ }, t))
  expect(await screen.findByRole('heading', { name: /Quang Trung – Nguyễn Huệ/ })).toBeTruthy()
  fireEvent.click(screen.getByText(/Quay lại chọn địa điểm/))
  fireEvent.click(await screen.findByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/))
  expect(await screen.findByText(/Khởi nghĩa Nam Kỳ là gì/)).toBeTruthy()
  fireEvent.click(screen.getByText(/Về Việt Nam/))
  fireEvent.click(await screen.findByText(/🏫 Đường Nguyễn Du/))
  expect(await screen.findByText('Năm 1874')).toBeTruthy()
  // ghim trường: biểu tượng + tên trường (luôn có vị trí dự phòng nên hiện kể cả khi không tải được dữ liệu OSM)
  expect(document.body.textContent).toContain('TRƯỜNG TRUNG HỌC CƠ SỞ VÀ TRUNG HỌC PHỔ THÔNG TRẦN ĐẠI NGHĨA')
  expect(document.body.textContent).toContain('53 Nguyễn Du, Sài Gòn, Hồ Chí Minh, Việt Nam')
})

test('màn tổng quan: khung các đảo, không còn khung Nam Bộ', async () => {
  render(<App />)
  fireEvent.click(screen.getByTestId('globe'))
  await screen.findByText(/🛣️ Đường Nguyễn Huệ/, {}, t)
  const txt = document.body.textContent ?? ''
  for (const n of ['Quần đảo Hoàng Sa', 'Quần đảo Trường Sa', 'Đảo Phú Quốc', 'Côn Đảo']) expect(txt).toContain(n)
  expect(txt).not.toContain('Nam Bộ')
})
