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
test('hành trình đầy đủ: địa cầu → menu → Nguyễn Huệ → Nam Kỳ → Nguyễn Du', async () => {
  render(<App />)
  fireEvent.click(screen.getByTestId('globe'))
  fireEvent.click(await screen.findByText(/Khu vực TP/, {}, t))
  fireEvent.click(await screen.findByText(/🛣️ Đường Nguyễn Huệ/))
  for (let i = 0; i < 3; i++) fireEvent.click(await screen.findByRole('button', { name: /Tiếp theo/ }, t))
  fireEvent.click(await screen.findByRole('button', { name: /Xem nhân vật/ }, t))
  expect(await screen.findByRole('heading', { name: /Quang Trung – Nguyễn Huệ/ })).toBeTruthy()
  fireEvent.click(screen.getByText(/Quay lại chọn địa điểm/))
  fireEvent.click(await screen.findByRole('button', { name: /Vùng Nam Bộ/ }))
  expect(await screen.findByText(/Khởi nghĩa Nam Kỳ là gì/)).toBeTruthy()
  fireEvent.click(screen.getByText(/Về Việt Nam/))
  fireEvent.click(await screen.findByText(/Khu vực TP/))
  fireEvent.click(await screen.findByText(/🏫 Đường Nguyễn Du/))
  expect(await screen.findByText('Năm 1874')).toBeTruthy()
})
