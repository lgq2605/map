import { useState } from 'react'
import type { LL } from '../data/geo'

// Vị trí khung Street View: trên điện thoại nằm phía trên bản đồ, trên máy tính nằm góc dưới trái (cạnh nút loa).
const svPos = 'absolute left-2 top-16 z-20 md:bottom-4 md:left-[6.75rem] md:top-auto'
const svBox = 'overflow-hidden rounded-xl border border-slate-300 bg-white text-slate-800 shadow-lg'
const svBtn = 'min-h-11 rounded-full border border-slate-300 bg-white px-4 font-medium text-slate-800 shadow-md hover:bg-slate-50'

// heading: hướng nhìn ban đầu (độ, 0 = Bắc)
const svLink = (at: LL, heading: number) => `https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${at.join(',')}&heading=${heading}`

function StreetViewFrame({ at, heading, title, className }: { at: LL; heading: number; title: string; className: string }) {
  return (
    <iframe title={title} className={className} loading="lazy" allowFullScreen
      src={`https://maps.google.com/maps?q=&layer=c&cbll=${at.join(',')}&cbp=12,${heading},0,0,0&output=svembed`} />
  )
}

// Nút "Street View" (không tự bật: người xem bấm mới mở khung nhúng — khung dùng giao diện sáng/trắng).
export default function StreetView({ at, heading, title }: { at: LL; heading: number; title: string }) {
  const [open, setOpen] = useState(false)
  return open ? (
    <div className={svPos + ' w-[calc(100%-1rem)] md:w-[min(560px,55vw)] ' + svBox}>
      <StreetViewFrame at={at} heading={heading} title={title} className="h-36 w-full md:h-72" />
      <div className="flex justify-between px-3 py-2 text-xs">
        <a className="font-medium text-blue-700 underline" target="_blank" rel="noreferrer" href={svLink(at, heading)}>Mở Street View ↗</a>
        <button onClick={() => setOpen(false)} className="text-slate-600 hover:text-slate-900">✕ Đóng</button>
      </div>
    </div>
  ) : (
    <button onClick={() => setOpen(true)} className={svPos + ' ' + svBtn}>👁️ Street View</button>
  )
}
