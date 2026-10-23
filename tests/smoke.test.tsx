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
test('hành trình đầy đủ: địa cầu → nút TP.HCM → 3 con đường → Nguyễn Huệ → Nam Kỳ → Nguyễn Du', async () => {
  render(<App />)
  expect(screen.getByRole('heading', { name: 'Một cái tên, ngàn câu chuyện' })).toBeTruthy()
  fireEvent.click(screen.getByTestId('globe'))
  // màn bản đồ Việt Nam: chỉ có NÚT Thành phố Hồ Chí Minh, 3 con đường chưa hiện
  expect(await screen.findByRole('button', { name: /Thành phố Hồ Chí Minh/ }, t)).toBeTruthy()
  expect(screen.queryByText(/Đường Nguyễn Huệ/)).toBeNull()
  // bấm nút: phóng tới TP.HCM và hiện 3 con đường
  fireEvent.click(screen.getByRole('button', { name: /Thành phố Hồ Chí Minh/ }))
  expect(await screen.findByText(/🛣️ Đường Nguyễn Huệ/, {}, t)).toBeTruthy()
  expect(screen.getByText(/🏫 Đường Nguyễn Du/)).toBeTruthy()
  expect(screen.getByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/)).toBeTruthy()
  fireEvent.click(screen.getByText(/🛣️ Đường Nguyễn Huệ/))
  // Street View không tự bật: chỉ có nút, chưa có khung nhúng
  expect(await screen.findByRole('button', { name: /Street View/ })).toBeTruthy()
  expect(document.querySelector('iframe')).toBeNull()
  for (let i = 0; i < 3; i++) fireEvent.click(await screen.findByRole('button', { name: /Tiếp theo/ }, t))
  fireEvent.click(await screen.findByRole('button', { name: /Xem nhân vật/ }, t))
  expect(await screen.findByRole('heading', { name: /Quang Trung – Nguyễn Huệ/ })).toBeTruthy()
  // xem hết thông tin (cả nhân vật): có nút quay lại chọn 3 con đường
  expect(await screen.findByRole('button', { name: /Quay lại chọn 3 con đường/ }, t)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Quay lại chọn 3 con đường/ }))
  // quay ĐÚNG về màn chọn 3 con đường (không quay ra bản đồ toàn quốc)
  expect(await screen.findByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/, {}, t)).toBeTruthy()
  fireEvent.click(screen.getByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/))
  expect(await screen.findByText(/Khởi nghĩa Nam Kỳ là gì/)).toBeTruthy()
  expect(await screen.findByRole('button', { name: /Quay lại chọn 3 con đường/ }, t)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /Quay lại chọn 3 con đường/ }))
  expect(await screen.findByText(/🏫 Đường Nguyễn Du/, {}, t)).toBeTruthy()
  fireEvent.click(screen.getByText(/🏫 Đường Nguyễn Du/))
  expect(await screen.findByText('Năm 1874')).toBeTruthy()
  // logo trường (mũ cử nhân + tên trường) luôn hiện ở toạ độ đã chỉ định, kể cả khi không tải được dữ liệu OSM
  expect(document.body.textContent).toContain('TRƯỜNG TRUNG HỌC CƠ SỞ VÀ TRUNG HỌC PHỔ THÔNG TRẦN ĐẠI NGHĨA')
  expect(document.body.textContent).toContain('53 Nguyễn Du, Sài Gòn, Hồ Chí Minh, Việt Nam')
})

test('màn tổng quan: khung các đảo, không còn khung Nam Bộ', async () => {
  render(<App />)
  fireEvent.click(screen.getByTestId('globe'))
  await screen.findByRole('button', { name: /Thành phố Hồ Chí Minh/ }, t)
  const txt = document.body.textContent ?? ''
  for (const n of ['Quần đảo Hoàng Sa', 'Quần đảo Trường Sa', 'Đảo Phú Quốc', 'Côn Đảo']) expect(txt).toContain(n)
  expect(txt).not.toContain('Nam Bộ')
})
