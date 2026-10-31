import type { ReactNode } from 'react'
// Chú thích nhỏ hiện khi rê chuột / focus bàn phím. aria-hidden: tên nút đã có aria-label/chữ rồi.
export default function Tooltip({ label, pos = 'below', children }: { label: string; pos?: 'below' | 'right'; children: ReactNode }) {
  const place = pos === 'right' ? 'left-full top-1/2 ml-2 -translate-y-1/2' : 'right-0 top-full mt-2'
  return (
    <span className="group/tip relative inline-flex">
      {children}
      <span aria-hidden="true" className={`pointer-events-none absolute z-10 whitespace-nowrap rounded-full border border-gold/40 bg-black/80 px-2.5 py-1 text-[11px] text-paper opacity-0 shadow-lg transition-opacity duration-200 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100 ${place}`}>{label}</span>
    </span>
  )
}
