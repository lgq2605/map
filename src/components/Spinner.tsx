// Vòng tải tuỳ chỉnh: vòng tròn vàng quay + ngôi sao đỏ ở giữa.
export default function Spinner({ size = 48, label = 'Đang tải' }: { size?: number; label?: string }) {
  return (
    <svg role="status" aria-label={label} viewBox="0 0 48 48" width={size} height={size}>
      <circle cx="24" cy="24" r="19" fill="none" stroke="rgba(255,205,0,.18)" strokeWidth="3" />
      <circle cx="24" cy="24" r="19" fill="none" stroke="#ffcd00" strokeWidth="3" strokeLinecap="round" strokeDasharray="30 90" style={{ filter: 'drop-shadow(0 0 5px #ffcd00)' }}>
        <animateTransform attributeName="transform" type="rotate" from="0 24 24" to="360 24 24" dur="1.1s" repeatCount="indefinite" />
      </circle>
      <path d="M24 15.5l2.5 5.2 5.7.8-4.1 4 1 5.6L24 28.4l-5.1 2.7 1-5.6-4.1-4 5.7-.8z" fill="#da251d" />
    </svg>
  )
}
