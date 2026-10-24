// Lớp nhiễu hạt phim + vignette phủ toàn màn hình (kể cả bản đồ). pointer-events: none.
export default function FilmOverlay() {
  return <><div className="film-vignette" aria-hidden="true" /><div className="film-noise" aria-hidden="true" /></>
}
