import { useState } from 'react'
import LocationPanel from '../components/LocationPanel'
import { nguyenHue } from '../data/nguyenHue'

const LL = '10.7743,106.7038'
export default function NguyenHueScene({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState(false) // không tự bật: người xem bấm nút 👁️ Street View mới mở
  const pos = 'absolute left-2 top-16 z-20 md:bottom-4 md:left-[6.75rem] md:top-auto'
  return (
    <>
      <LocationPanel data={nguyenHue} onBack={onBack} />
      {open ? (
        <div className={pos + ' w-[calc(100%-1rem)] overflow-hidden museum-frame bg-navy shadow-2xl md:w-[min(560px,55vw)]'}>
          <iframe title="Street View đường Nguyễn Huệ" className="h-36 w-full md:h-72" loading="lazy" allowFullScreen
            src={`https://maps.google.com/maps?q=&layer=c&cbll=${LL}&cbp=12,0,0,0,0&output=svembed`} />
          <div className="flex justify-between px-3 py-2 text-xs">
            <a className="underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${LL}`}>Mở Street View ↗</a>
            <button onClick={() => setOpen(false)}>✕ Đóng</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className={pos + ' glass-pill min-h-11 rounded-full px-4 text-gold'}>👁️ Street View</button>
      )}
    </>
  )
}
