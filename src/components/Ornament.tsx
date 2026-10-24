// Đường kẻ trang trí hoa văn Việt (hoa sen + vân xoắn) dưới tên nhân vật.
export default function Ornament({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 260 18" className={className} fill="none" aria-hidden="true" preserveAspectRatio="xMinYMid meet">
      <defs>
        <linearGradient id="orn-g" x1="0" x2="1"><stop offset="0" stopColor="#ffcd00" /><stop offset=".6" stopColor="#ffcd00" stopOpacity=".7" /><stop offset="1" stopColor="#da251d" stopOpacity="0" /></linearGradient>
      </defs>
      <g stroke="url(#orn-g)" strokeWidth="1.3" strokeLinecap="round">
        <path d="M2 9H62" /><path d="M96 9H258" />
        <path d="M62 9c4-6 9-6 11 0s-7 6-11 0z" /><path d="M73 9c3-5 7-5 9 0" />
      </g>
      <g fill="#ffcd00">
        <path d="M79 1.5L86.5 9 79 16.5 71.5 9z" opacity=".95" />
        <circle cx="92" cy="9" r="1.6" /><circle cx="100" cy="9" r="1" opacity=".7" />
      </g>
      <path d="M79 5.2L82.8 9 79 12.8 75.2 9z" fill="#da251d" />
    </svg>
  )
}
