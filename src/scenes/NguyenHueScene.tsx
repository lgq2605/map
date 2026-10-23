import { useState } from 'react'
import LocationPanel from '../components/LocationPanel'
import { nguyenHue } from '../data/nguyenHue'

const LL = '10.7743,106.7038'
export default function NguyenHueScene({ onBack }: { onBack: () => void }) {
  const [open, setOpen] = useState(() => matchMedia('(min-width: 768px)').matches)
  const pos = 'absolute left-2 top-16 z-20 md:bottom-4 md:left-4 md:top-auto'
  return (
    <>
      <LocationPanel data={nguyenHue} onBack={onBack} />
      {open ? (
        <div className={pos + ' w-[calc(100%-1rem)] overflow-hidden rounded-xl border border-gold/40 bg-navy shadow-2xl md:w-[min(560px,55vw)]'}>
          <iframe title="Street View đường Nguyễn Huệ" className="h-36 w-full md:h-72" loading="lazy" allowFullScreen
            src={`https://maps.google.com/maps?q=&layer=c&cbll=${LL}&cbp=12,0,0,0,0&output=svembed`} />
          <div className="flex justify-between px-3 py-2 text-xs">
            <a className="underline" target="_blank" rel="noreferrer" href={`https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=${LL}`}>Mở Street View ↗</a>
            <button onClick={() => setOpen(false)}>✕ Đóng</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setOpen(true)} className={pos + ' min-h-11 rounded-full border border-gold bg-navy/85 px-4 text-gold transition duration-200 hover:scale-105'}>👁️ Street View</button>
      )}
    </>
  )
}
