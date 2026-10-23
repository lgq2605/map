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
// Nam Kỳ gõ chữ cùng tốc độ 18ms/chữ như 2 đường kia (đoạn dài ~500 chữ ≈ 9s, 5 ý ≈ 16s)
const slow = { timeout: 30000 }
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
  // xem hết thông tin (cả nhân vật): có nút Quay lại
  expect(await screen.findByRole('button', { name: /^Quay lại$/ }, t)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /^Quay lại$/ }))
  // quay ĐÚNG về màn chọn 3 con đường (không quay ra bản đồ toàn quốc)
  expect(await screen.findByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/, {}, t)).toBeTruthy()
  // Nam Kỳ: lịch sử 3 phần, lần lượt qua nút "Tiếp theo", cuối cùng có ảnh sự kiện + nút Quay lại
  fireEvent.click(screen.getByText(/🔥 Đường Nam Kỳ Khởi Nghĩa/))
  expect(await screen.findByRole('heading', { name: '🔥 Đường Nam Kỳ Khởi Nghĩa' })).toBeTruthy()
  expect(await screen.findByText('📖 Nguồn gốc tên đường')).toBeTruthy()
  fireEvent.click(await screen.findByRole('button', { name: /Tiếp theo/ }, slow))
  expect(await screen.findByText('❓ Khởi nghĩa Nam Kỳ là gì?')).toBeTruthy()
  // các ý của "Khởi nghĩa Nam Kỳ là gì?" hiện LẦN LƯỢT (không gõ cùng lúc): lúc đầu chỉ có ý đầu tiên
  expect(screen.getByText('Thời gian:')).toBeTruthy()
  expect(screen.queryByText('Địa bàn:')).toBeNull()
  expect(await screen.findByText('Địa bàn:', {}, slow)).toBeTruthy()
  expect(screen.queryByText('Kết quả:')).toBeNull()
  fireEvent.click(await screen.findByRole('button', { name: /Tiếp theo/ }, { timeout: 40000 }))
  expect(await screen.findByText(/Khi nào con đường được đặt tên/)).toBeTruthy()
  expect(await screen.findByRole('button', { name: /^Quay lại$/ }, slow)).toBeTruthy()
  fireEvent.click(screen.getByRole('button', { name: /^Quay lại$/ }))
  expect(await screen.findByText(/🏫 Đường Nguyễn Du/, {}, t)).toBeTruthy()
  fireEvent.click(screen.getByText(/🏫 Đường Nguyễn Du/))
  expect(await screen.findByText('Năm 1874')).toBeTruthy()
  // ghim trường: CHỈ còn logo (không còn chữ tên trường/địa chỉ), logo là ảnh tròn tại vị trí ghim
  expect(document.body.textContent).not.toContain('TRƯỜNG TRUNG HỌC CƠ SỞ')
  expect(document.querySelector('img[alt^="Logo trường THCS và THPT"]')).toBeTruthy()
})

test('màn tổng quan: khung các đảo, không còn khung Nam Bộ', async () => {
  render(<App />)
  fireEvent.click(screen.getByTestId('globe'))
  await screen.findByRole('button', { name: /Thành phố Hồ Chí Minh/ }, t)
  const txt = document.body.textContent ?? ''
  for (const n of ['Quần đảo Hoàng Sa', 'Quần đảo Trường Sa', 'Đảo Phú Quốc', 'Côn Đảo']) expect(txt).toContain(n)
  expect(txt).not.toContain('Nam Bộ')
})
