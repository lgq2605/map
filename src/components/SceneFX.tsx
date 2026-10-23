import StarTwinkle from './StarTwinkle'

// Lớp trang trí đặt TRÊN nền (địa cầu / bản đồ) nhưng DƯỚI bảng thông tin và nút:
//   sao nhấp nháy (chỉ Scene 1) → noise 3% → vignette 4 góc.
// Toàn bộ pointer-events: none — không chặn bất kỳ thao tác nào của bản đồ / địa cầu.
export default function SceneFX({ stars = false }: { stars?: boolean }) {
  return (
    <div aria-hidden="true" className="fx-layer fx-root">
      {stars && <StarTwinkle />}
      <div className="fx-layer fx-noise" />
      <div className="fx-layer fx-vignette" />
    </div>
  )
}
