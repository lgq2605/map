// Bộ icon SVG nét mảnh (thay emoji ở các chỗ trang trí). Tất cả aria-hidden.
import type { SVGProps } from 'react'
const base = (p: SVGProps<SVGSVGElement>) => ({ viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true, width: 20, height: 20, ...p })
export const ArrowRight = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 12h15M13 6l6 6-6 6" /></svg>
export const ArrowDown = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 4v15M6 13l6 6 6-6" /></svg>
export const Chevron = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M6 9l6 6 6-6" /></svg>
export const GlobeIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" /></svg>
export const PinIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z" /><circle cx="12" cy="9.5" r="2.5" /></svg>
export const CalendarIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><rect x="3.5" y="5" width="17" height="15" rx="2" /><path d="M3.5 10h17M8 3v4M16 3v4" /></svg>
export const HomeIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 11l8-7 8 7M6 10v10h12V10M10 20v-5h4v5" /></svg>
export const FamilyIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="8" cy="8" r="2.6" /><circle cx="16.5" cy="9.5" r="2.1" /><path d="M3 19c0-3.2 2.2-5 5-5s5 1.8 5 5M14 19c0-2.4 1.5-4 3.5-4s3.5 1.6 3.5 4" /></svg>
export const PenIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z M14.5 6.5l3 3" /></svg>
export const StarIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.1 1 5.9L12 17l-5.2 2.7 1-5.9-4.3-4.1 5.9-.8z" /></svg>
export const SpeakerIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base({ fill: 'currentColor', strokeWidth: 1, ...p })}><path d="M3.5 9.5v5h3.8L13 19.2V4.8L7.3 9.5z" /></svg>
export const UserIcon = (p: SVGProps<SVGSVGElement>) => <svg {...base(p)}><circle cx="12" cy="8" r="3.6" /><path d="M5 20c0-3.6 3-6 7-6s7 2.4 7 6" /></svg>

// Icon dòng thông tin của hồ sơ nhân vật: đổi emoji đầu dòng (🏡 👨‍👩‍👦 ✏️ ⭐) sang icon SVG mảnh.
export function iconForEmoji(e: string) {
  if (e.startsWith('🏡')) return HomeIcon
  if (e.startsWith('👨')) return FamilyIcon
  if (e.startsWith('✏')) return PenIcon
  if (e.startsWith('⭐')) return StarIcon
  return StarIcon
}
